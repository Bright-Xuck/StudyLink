'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AllCourses } from '@/Constant/constant';
import type { ICourse } from '@/components/CourseCard/CourseCard';
import type { ITestimony } from '@/components/HomepageComp/Testimonials';
import type { IFaq } from '@/components/HomepageComp/Faq';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface User {
  name: string;
  email: string;
  phone: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AppState {
  // UI states
  isNavOpen: boolean;
  isWishlistOpen: boolean;
  isNotificationOpen: boolean;
  showPaymentModal: boolean;
  showTryFreeModal: boolean;

  // Courses and data
  allCourses: ICourse[];
  testimonies: ITestimony[];
  faqs: IFaq[];
  notificationList: Notification[];

  // Filters
  filtersByTime: string[];
  filtersByType: string[];
  filteredByTimeCourses: ICourse[];
  filteredByTypeCourses: ICourse[];

  // Search
  searchQuery: string;
  isSearching: boolean;
  filteredBySearchCourses: ICourse[];
  filteredSearchCoursesByType: ICourse[];

  // Active items
  activeTestimonials: number;
  activeFaqId: string | null;

  // User data
  user: User | null;
  course: ICourse | null;
  contactForm: ContactForm;
}

type AppAction =
  | { type: 'TOGGLE_NAV' }
  | { type: 'CLOSE_NAV' }
  | { type: 'SHOW_WISHLIST' }
  | { type: 'HIDE_WISHLIST' }
  | { type: 'SHOW_NOTIFICATION' }
  | { type: 'HIDE_NOTIFICATION' }
  | { type: 'SET_SHOW_PAYMENT_MODAL'; payload: boolean }
  | { type: 'SET_SHOW_TRY_FREE_MODAL'; payload: boolean }
  | { type: 'SET_FILTERS_BY_TIME'; payload: string[] }
  | { type: 'SET_FILTERED_BY_TIME_COURSES'; payload: ICourse[] }
  | { type: 'SET_FILTERS_BY_TYPE'; payload: string[] }
  | { type: 'SET_FILTERED_BY_TYPE_COURSES'; payload: ICourse[] }
  | { type: 'TOGGLE_LOVED'; payload: number }
  | { type: 'REMOVE_FROM_FAVORITE'; payload: number }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'PUSH_NOTIFICATION'; payload: Notification }
  | { type: 'SET_ACTIVE_TESTIMONIALS'; payload: number }
  | { type: 'RESET_ACTIVE_TESTIMONIALS' }
  | { type: 'SHOW_FAQ_ANSWER'; payload: string }
  | { type: 'SET_FILTER_COURSES_BY_SEARCH'; payload: ICourse[] }
  | { type: 'SET_FILTER_SEARCHED_COURSES_BY_TYPE'; payload: ICourse[] }
  | { type: 'RESET_FILTERS_BY_TYPE' }
  | { type: 'SET_CONTACT_FORM'; payload: ContactForm }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'RESET_SEARCH_QUERY' }
  | { type: 'GET_COURSE_BY_ID'; payload: number }
  | { type: 'GET_COURSE_BY_NAME'; payload: string }
  | { type: 'SET_USER_DATA'; payload: User };

const initialState: AppState = {
  isNavOpen: false,
  isWishlistOpen: false,
  isNotificationOpen: false,
  showPaymentModal: false,
  showTryFreeModal: false,
  allCourses: AllCourses,
  testimonies: [],
  faqs: [],
  notificationList: [],
  filtersByTime: [],
  filtersByType: [],
  filteredByTimeCourses: AllCourses,
  filteredByTypeCourses: AllCourses,
  searchQuery: '',
  isSearching: false,
  filteredBySearchCourses: AllCourses,
  filteredSearchCoursesByType: AllCourses,
  activeTestimonials: 0,
  activeFaqId: null,
  user: null,
  course: null,
  contactForm: {
    name: '',
    email: '',
    subject: '',
    message: '',
  },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_NAV':
      return { ...state, isNavOpen: !state.isNavOpen };
    case 'CLOSE_NAV':
      return { ...state, isNavOpen: false };
    case 'SHOW_WISHLIST':
      return { ...state, isWishlistOpen: true };
    case 'HIDE_WISHLIST':
      return { ...state, isWishlistOpen: false };
    case 'SHOW_NOTIFICATION':
      return { ...state, isNotificationOpen: true };
    case 'HIDE_NOTIFICATION':
      return { ...state, isNotificationOpen: false };
    case 'SET_SHOW_PAYMENT_MODAL':
      return { ...state, showPaymentModal: action.payload };
    case 'SET_SHOW_TRY_FREE_MODAL':
      return { ...state, showTryFreeModal: action.payload };
    case 'SET_FILTERS_BY_TIME':
      return { ...state, filtersByTime: action.payload };
    case 'SET_FILTERED_BY_TIME_COURSES':
      return { ...state, filteredByTimeCourses: action.payload };
    case 'SET_FILTERS_BY_TYPE':
      return { ...state, filtersByType: action.payload };
    case 'SET_FILTERED_BY_TYPE_COURSES':
      return { ...state, filteredByTypeCourses: action.payload };
    case 'TOGGLE_LOVED': {
      const updatedCourses = state.allCourses.map((course) =>
        course.id === action.payload ? { ...course, isLoved: !course.isLoved } : course
      );
      return { ...state, allCourses: updatedCourses };
    }
    case 'REMOVE_FROM_FAVORITE': {
      const updatedCourses = state.allCourses.map((course) =>
        course.id === action.payload ? { ...course, isLoved: false } : course
      );
      return { ...state, allCourses: updatedCourses };
    }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notificationList: state.notificationList.filter((n) => n.id !== action.payload),
      };
    case 'PUSH_NOTIFICATION':
      return { ...state, notificationList: [...state.notificationList, action.payload] };
    case 'SET_ACTIVE_TESTIMONIALS':
      return { ...state, activeTestimonials: action.payload };
    case 'RESET_ACTIVE_TESTIMONIALS':
      return { ...state, activeTestimonials: 0 };
    case 'SHOW_FAQ_ANSWER':
      return { ...state, activeFaqId: action.payload };
    case 'SET_FILTER_COURSES_BY_SEARCH':
      return { ...state, filteredBySearchCourses: action.payload };
    case 'SET_FILTER_SEARCHED_COURSES_BY_TYPE':
      return { ...state, filteredSearchCoursesByType: action.payload };
    case 'RESET_FILTERS_BY_TYPE':
      return { ...state, filtersByType: [], filteredByTypeCourses: state.allCourses };
    case 'SET_CONTACT_FORM':
      return { ...state, contactForm: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'RESET_SEARCH_QUERY':
      return { ...state, searchQuery: '', filteredBySearchCourses: state.allCourses };
    case 'GET_COURSE_BY_ID': {
      const course = state.allCourses.find((c) => c.id === action.payload) || null;
      return { ...state, course };
    }
    case 'GET_COURSE_BY_NAME': {
      const course = state.allCourses.find((c) => c.name === action.payload) || null;
      return { ...state, course };
    }
    case 'SET_USER_DATA':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context.state;
}

export function useAppDispatch() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within AppProvider');
  }
  return context.dispatch;
}
