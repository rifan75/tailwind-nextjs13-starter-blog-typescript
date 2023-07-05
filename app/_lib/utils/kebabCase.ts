import { slug } from "github-slugger";

const kebabCase = (str: string | string[]) => slug(str as string);

export default kebabCase;
