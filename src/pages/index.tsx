import { useContext, useState } from "react";
import BookmarkButton from "../components/BookMarkButton";
import { Inter } from "next/font/google";
import { Box, Button, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { AppContext, bookMarkMovieActionKind } from "../context";
import WatchedButton from "@/components/watchedButton";
import SearchForm from "@/components/SearchForm";

const inter = Inter({ subsets: ["latin"] });
export type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  bookMarked: boolean;
  watched: boolean;
};
type SearchResult = {
  Search: Movie[];
  totalResults: string;
  Response: string;
};

export default function Home() {
  const [showBookMarkedList, setshowBookMarkedList] = useState(false);
  const [showWatchedList, setshowWatchedList] = useState(false);
  const { state, dispatch } = useContext(AppContext);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const handleShowWatchedList = () => {
    setshowWatchedList(!showWatchedList);
  };
  const handleShowBookMarkedList = () => {
    setshowBookMarkedList(!showBookMarkedList);
  };
  const handleClearWatchedList = () => {
    dispatch({
      type: bookMarkMovieActionKind.CLEAR,
      payload: {
        clearType: "Watched",
      },
    });
  };
  const handleClearBookMarkedList = () => {
    dispatch({
      type: bookMarkMovieActionKind.CLEAR,
      payload: {
        clearType: "Bookmark",
      },
    });
  };
  const handleSearch = async (query: string, pageNumber?: number) => {
    setQuery(query);
    if (
      !movies.some((movie) =>
        movie.Title.toLowerCase().includes(query.toLowerCase())
      )
    ) {
      setCurrentPage(1);
    }
    const axios = require("axios");
    const options = {
      method: "GET",
      url: process.env.NEXT_PUBLIC_API_URL,
      params: {
        s: query,
        r: "json",
        page: pageNumber?.toString() ?? 1,
      },
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_X_RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.NEXT_PUBLIC_X_RAPIDAPI_HOST,
      },
    };
    await axios
      .request(options)
      .then(function ({ data }: { data: SearchResult }) {
        if (data) {
          console.log("data", data);
          setNumberOfPages(Math.ceil(parseInt(data.totalResults) / 10));
          setMovies(data.Search);
        } else {
          setMovies([]);
        }
      })
      .catch(function (error: string) {
        console.error(error);
      });
  };
  return (
    <Box>
      <Heading>Movie Tracker: </Heading>
      <p>
        Search a movie, and add, or remove it from your watch/Bookmarked list
      </p>
      <SearchForm handleSearch={handleSearch} />
      <br></br>
      <Button colorScheme="blue" onClick={handleShowBookMarkedList}>
        Show BookMark List
      </Button>
      <Button ml={2} colorScheme="blue" onClick={handleClearBookMarkedList}>
        Clear BookMark List
      </Button>
      <Button ml={2} colorScheme="blue" onClick={handleShowWatchedList}>
        Show Watch List
      </Button>
      <Button ml={2} colorScheme="blue" onClick={handleClearWatchedList}>
        Clear Watched List
      </Button>
      <Flex>
        {movies ? (
          movies.length > 0 ? (
            <Box>
              <DisplayMovieList
                movieList={movies}
                title={"Movies: "}
                type="Movies"
                query={query}
                handleSearch={handleSearch}
                numberOfPages={numberOfPages}
              />
            </Box>
          ) : (
            <Box mt={8}>
              <Text>No movies found.</Text>
            </Box>
          )
        ) : (
          <Box mt={8}>
            <Text>No movies found. Please check spelling of the movie</Text>
          </Box>
        )}

        {showBookMarkedList && (
          <DisplayMovieList
            movieList={state.bookMarkedMovies}
            title="Bookmarked Movies:"
            type={"Bookmark"}
          />
        )}
        {showWatchedList && (
          <DisplayMovieList
            movieList={state.watchedMovies}
            title="Watched Movies:"
            type={"Watched"}
          />
        )}
      </Flex>
    </Box>
  );
}
interface IMyProps {
  movieList: Movie[];
  title: string;
  type: string;
  query?: string;
  handleSearch?: (query: string, pageNumber?: number) => void;
  numberOfPages?: number
  
}
const DisplayMovieList: React.FC<IMyProps> = ({
  movieList,
  title,
  type,
  query,
  handleSearch,
  numberOfPages
}: IMyProps) => {
  return (
    <Box>
      {movieList.length > 0 ? (
        <Box mt={8} ml={8}>
          <Heading as="h4" size="md">
            {title}
          </Heading>
          {movieList.map((movie) => (
            <Flex key={movie.imdbID}>
              <Box mb={4}>
                <Text fontWeight="bold">{movie.Title}</Text>
                <Text>
                  Released: {movie.Year} | Type: {movie.Type}
                </Text>
                {type == "Bookmark" && <WatchedButton movie={movie} />}
                {type == "Movies" && <BookmarkButton movie={movie} />}
              </Box>
              {movie.Poster !== "N/A" ? (
                <Image ml={8} mb={8} src={movie.Poster} boxSize="100px"></Image>
              ) : null}
            </Flex>
          ))}
        </Box>
      ) : (
        <Box mt={8} ml={8}>
          <Text>
            No movies have been {type == "Bookmark" ? "Bookmarked" : "Watched"}.
            Please {type == "Bookmark" ? "Bookmarked" : "Watched"} a movie
          </Text>
        </Box>
      )}
      {numberOfPages &&handleSearch && query && <PaginationButtons numberOfPages={numberOfPages} handleSearch={handleSearch} query={query} />}
    </Box>
  );
};
interface IPaginationButtons {
  query: string;
  handleSearch: (query: string, pageNumber?: number) => void;
  numberOfPages: number
  
}
function PaginationButtons({handleSearch, query, numberOfPages}: IPaginationButtons) {
  const { state } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  

  const handlePrevPage = () => {
    if (currentPage != 1) {
      let decreasePageNum = currentPage - 1;
      setCurrentPage(decreasePageNum);
      handleSearch(query, decreasePageNum);
    }
  };
  const handleNextPage = () => {
    if (currentPage < numberOfPages) {
      let increasePageNum = currentPage + 1;
      setCurrentPage(increasePageNum);
      handleSearch(query, increasePageNum);
    }
  };
  return (
    <Flex mt={8}>
      <Button onClick={handlePrevPage} disabled={currentPage === 1}>
        Previous Page
      </Button>
      <Text mt={2} ml={2} mr={2}>
        Page {currentPage} of {numberOfPages}
      </Text>
      <Button
        onClick={handleNextPage}
        disabled={currentPage === state.numberOfPages}
      >
        Next Page
      </Button>
    </Flex>
  );
}

