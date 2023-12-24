import {useHttp} from '../hooks/http.hook';

const useMarvelService = () => {
  const {loading, request, error, clearError} = useHttp();

  const _apiBase = "https://gateway.marvel.com:443/v1/public/";
  const _apiKey = "apikey=b4da3f147f83e1bff6f282d1efe16769";
  const _baseOffset = 440;

  const getAllCharacters = async (offset =_baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);

    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
		const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
		return _transformCharacter(res.data.results[0]);
	};

  const getAllComics = async (offset = 0) => {
    const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
    
    return res.data.results.map(_transformComics);
  };

  const getComic = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);

    return _transformComics(res.data.results[0]);
  };

  const _transformComics = (comics) => {
		return {
			id: comics.id,
			title: comics.title,
			description: comics.description || "Sorry, someone stole the description",
			pageCount: comics.pageCount
				? `${comics.pageCount} p.`
				: "No information about the number of pages",
			thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
			language: comics.textObjects[0]?.language || "en-us",
			price: comics.prices[0].price
				? `${comics.prices[0].price}$`
				: "not available",
		};
	};

  const _transformCharacter = (char) => {
    return {
      name: char.name,
      description: char.description
      ? `${char.description.slice(0, 210)}...`
      : "Sorry, someone stole this character's description",
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      id: char.id,
      comics: char.comics.items,
    };
  };

  return {loading, error, getAllCharacters, getCharacter, clearError, getAllComics, getComic};
}

export default useMarvelService;
