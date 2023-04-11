import { Checkbox } from "@chakra-ui/react";
import { useContext } from "react";
import { Movie } from "../pages";
import { AppContext, bookMarkMovieActionKind } from "../context";

type Props = {
  movie: Movie;
};

const BookmarkButton = ({ movie }: Props): JSX.Element => {
  const { state, dispatch } = useContext(AppContext);
  const watched =
    state.watchedMovies.filter((movieList) => movieList.imdbID == movie.imdbID)[0]
      ?.watched ?? false;
  const handleWatched = () => {
    dispatch({
      type: bookMarkMovieActionKind.WATCHED,
      payload: {
        Title: movie.Title,
        Year: movie.Year,
        imdbID: movie.imdbID,
        Type: movie.Type,
        Poster: movie.Poster,
        bookMarked: movie.bookMarked,
        watched: true
      },
    });
  };

  const handleUnwatched = () => {
    dispatch({
      type: bookMarkMovieActionKind.REMOVEWATCHED,
      payload: {
        Title: movie.Title,
        Year: movie.Year,
        imdbID: movie.imdbID,
        Type: movie.Type,
        Poster: movie.Poster,
        bookMarked: movie.bookMarked,
        watched: false
      },
    });
  };
  return (
    <Checkbox
      onChange={watched ? handleUnwatched : handleWatched}
    >
      {watched ? "Watched" : "Watch"}
    </Checkbox>
  );
};

export default BookmarkButton;
