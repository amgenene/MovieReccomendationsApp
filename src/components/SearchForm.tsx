import { Button, Flex, Input } from "@chakra-ui/react";
import { useState } from "react";
import { Movie } from "../pages";
type SearchResult = {
  Search: Movie[];
  totalResults: string;
  Response: string;
};
type Props = {
    handleSearch: (query: string, pageNumber?: number) => void;
  };
const SearchForm = ({ handleSearch }: Props): JSX.Element => {
  const [query, setQuery] = useState("");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(query);
  };
  return (
    <form onSubmit={handleSubmit}>
      <Flex alignItems="center">
        <Input
          type="text"
          placeholder="Search movies by title"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          mr={4}
        />
        <Button type="submit" colorScheme="blue">
          Search
        </Button>
      </Flex>
    </form>
  );
};

export default SearchForm;
