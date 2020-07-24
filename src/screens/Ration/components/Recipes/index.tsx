import React from "react";
import { useRecipeListingSubscription } from "../../../../graphql/generated/graphql";
import { RecipeCard } from "./RecipeCard";

interface Props {}

export const Recipes = ({}: Props) => {
  const { data } = useRecipeListingSubscription();

  return (
    <>
      <RecipeCard name={"Add new recipe"} description={""} />
      {data?.recipe.map((recipe) => (
        <RecipeCard
          id={recipe.id}
          name={recipe.name}
          description={recipe.description}
          recipe_items={recipe.recipe_items as any}
          recipe_items_aggregate={recipe.recipe_items_aggregate as any}
        />
      ))}
    </>
  );
};