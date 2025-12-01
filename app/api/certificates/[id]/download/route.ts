import { NextRequest, NextResponse } from "next/server";
import { downloadCertificate } from "@/lib/actions/certificate.actions";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await downloadCertificate(params.id);

    if (!result.success || !result.html) {
      return NextResponse.json(
        { error: result.error || "Certificate not found" },
        { status: 404 }
      );
    }

    // Return HTML file for download
    return new NextResponse(result.html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="certificate-${result.certificate?.certificateNumber || params.id}.html"`,
      },
    });
  } catch (error) {
    console.error("Certificate download error:", error);
    return NextResponse.json(
      { error: "Failed to download certificate" },
      { status: 500 }
    );
  }
}
