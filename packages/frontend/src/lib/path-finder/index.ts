import axios from "axios";

import { PathFinderInput, PathFinderOutput } from "../../type/path-finder";

const base = "http://0.0.0.0:1080/v1/quote/calculate";

export const getFromPathFinder = async (param: PathFinderInput): Promise<PathFinderOutput> => {
  console.log("getFromPathFinder param:", param);
  const { data } = await axios.post(base, param);
  const output = data;
  console.log("getFromPathFinder output:", output);
  return output;
};
