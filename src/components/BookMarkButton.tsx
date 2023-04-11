import { Button } from "@chakra-ui/react";
import { useContext } from "react";
import { FaBookmark, FaCheck } from "react-icons/fa";
import { Movie } from "../pages";
import { AppContext, bookMarkMovieActionKind } from "../context";

type Props = {
  movie: Movie;
};

const BookmarkButton = ({ movie }: Props): JSX.Element => {
  const { state, dispatch } = useContext(AppContext);
  const bookMarked =
    state.bookMarkedMovies?.filter((movieList) => movieList.imdbID == movie.imdbID)[0]
      ?.bookMarked ?? false;
  const handleBookmark = () => {
    dispatch({
      type: bookMarkMovieActionKind.ADD,
      payload: {
        Title: movie.Title,
        Year: movie.Year,
        imdbID: movie.imdbID,
        Type: movie.Type,
        Poster: movie.Poster,
        bookMarked: true,
        watched: movie.watched
      },
    });
  };

  const handleUnbookmark = () => {
    dispatch({
      type: bookMarkMovieActionKind.REMOVE,
      payload: {
        Title: movie.Title,
        Year: movie.Year,
        imdbID: movie.imdbID,
        Type: movie.Type,
        Poster: movie.Poster,
        bookMarked: false,
        watched: movie.watched
      },
    });
  };
  return (
    <Button
      onClick={bookMarked ? handleUnbookmark : handleBookmark}
      leftIcon={bookMarked ? <FaCheck /> : <FaBookmark />}
      colorScheme={bookMarked ? "green" : "gray"}
    >
      {bookMarked ? "Bookmarked" : "Bookmark"}
    </Button>
  );
};

export default BookmarkButton;
