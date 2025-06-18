export interface Recipe {
  id: number; // For external API recipes
  _id?: string; // For MongoDB stored recipes
  externalId?: number; // For MongoDB stored recipes
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  diets: string[];
  dishTypes: string[];
  cuisines: string[];
}
