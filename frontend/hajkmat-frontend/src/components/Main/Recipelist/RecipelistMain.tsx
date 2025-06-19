import RecipeSearch from './Recipesearch';

const RecipelistMain = () => {
  return (
    <div className="container mx-auto px-4 flex justify-between items-center py-4">
      <h1 className="text-3xl font-bold mb-6">Upptäck recept</h1>
      <p className="text-gray-600 mb-8">Leta upp recept för din hajk</p>

      <RecipeSearch />
    </div>
  );
};

export default RecipelistMain;
