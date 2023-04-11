import { Dispatch, createContext, useReducer } from "react";
import { Movie } from "./pages";
export enum bookMarkMovieActionKind {
  ADD = "ADD",
  REMOVE = "REMOVE",
  CLEAR = "CLEAR",
  WATCHED = "WATCHED",
  REMOVEWATCHED = "REMOVEWATCHED"
}

// An interface for our actions
export interface bookMarkMovieAction {
  type: bookMarkMovieActionKind;
  payload?: {movies: Movie[]} | Movie | {queryString: string} | {totalResults: string}; // made payload optional because Clear doesn't need to use it
}
// An interface for our state
export interface initialStateType {
  movies: Movie[];
  bookMarkedMovies: Movie[];
  watchedMovies: Movie[];
  pageNumber: number;
  numberOfPages: number;
  queryString: string;
}
const movies: Movie[] = [];
export const initialState = {
  movies: [],
  bookMarkedMovies: [],
  watchedMovies: [],
  pageNumber: 1,
  numberOfPages: 0,
  queryString: ""
};
export function movieListReducer(
  state: initialStateType,
  action: bookMarkMovieAction
) {  
    const { type, payload } = action;
  switch (type) {
    //don't wanna add it to the list of bookmarked movies if already there
    case bookMarkMovieActionKind.ADD:
      if (payload) {
        if (!state.bookMarkedMovies.some((movie) => movie.imdbID === (payload as Movie).imdbID)) {
          state.bookMarkedMovies.push(payload as Movie);
        }
      }

      return {
        ...state,
      };
    case bookMarkMovieActionKind.REMOVE:
      if (payload) {
        state.bookMarkedMovies = state.bookMarkedMovies.filter(
          (movie) => movie.imdbID !== (payload as Movie).imdbID
        );
      }
      return {
        ...state,
      };
    case bookMarkMovieActionKind.CLEAR:
      state.bookMarkedMovies = [];
      return {
        ...state,
      };
    case bookMarkMovieActionKind.WATCHED:
      if (payload) {
        if (!state.watchedMovies.some((movie) => movie.imdbID === (payload as Movie).imdbID)) {
        state.watchedMovies.push(payload as Movie);
        }
      }
      return {
        ...state,
      };
    case bookMarkMovieActionKind.REMOVEWATCHED:
        if (payload) {
            state.watchedMovies = state.watchedMovies.filter(
              (movie) => movie.imdbID !== (payload as Movie).imdbID
            );
          }
      return {
        ...state,
      };
    default:
      return state;
  }
}



interface Props {
  children: React.ReactNode;
}
export const AppContext = createContext<{
  state: initialStateType;
  dispatch: Dispatch<bookMarkMovieAction>;
}>({ state: initialState, dispatch: () => null });

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(movieListReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
