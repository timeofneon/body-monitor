import React, { useEffect, useState } from "react";
import {
  CardContent,
  CardHeader,
  createStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { EditDeleteButtonGroup } from "../components/EditDeletButtonGroup";
import { AggregationChips } from "../../components/AggredationChips";
import { makeStyles } from "@material-ui/core/styles";
import {
  Recipe_Item_Aggregate,
  useAddRecipeMutation,
  useDeleteRecipeByPkMutation,
  useUpdateRecipeByPkMutation,
} from "../../graphql/generated/graphql";
import { useUser } from "../context/userContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      width: 220,
    },
    description: {
      margin: theme.spacing(1),
    },
    editableDescription: {
      width: "100%",
    },
  })
);

export interface RecipeCardHeaderProps {
  id?: string;
  name?: string | null;
  description?: string | null;
  recipe_items_aggregate?: Recipe_Item_Aggregate;
}

export const RecipeCardHeader = ({
  id,
  name,
  recipe_items_aggregate,
  description,
}: RecipeCardHeaderProps) => {
  const classes = useStyles();
  const { user } = useUser();
  const [isInEditMode, setEditMode] = useState();
  const [updatedName, setUpdatedName] = useState(name);
  const [updatedDesc, setUpdatedDesc] = useState(description);

  const [update_recipe_by_pk] = useUpdateRecipeByPkMutation({
    variables: { id, name: updatedName, description: updatedDesc },
    onCompleted: (data) => console.log("Success ", data),
    onError: (error) => console.log(error),
  });
  const [delete_recipe_by_pk] = useDeleteRecipeByPkMutation({
    variables: { id },
    onCompleted: (data) => console.log("Success ", data),
    onError: (error) => console.log(error),
  });

  const [insert_recipe_one] = useAddRecipeMutation({
    variables: {
      u_id: user?.id,
      name: updatedName,
      description: updatedDesc,
    },
  });

  useEffect(() => {
    if (!id) {
      setEditMode(true);
    }
  }, [id]);

  const macronutrients = recipe_items_aggregate?.aggregate?.sum;

  return (
    <>
      <CardHeader
        title={
          isInEditMode ? (
            <TextField
              defaultValue={name || updatedName}
              type={"text"}
              onChange={(event: any) => setUpdatedName(event?.target?.value)}
              className={classes.title}
            />
          ) : (
            name
          )
        }
        action={
          <EditDeleteButtonGroup
            onConfirmClick={
              isInEditMode
                ? () => {
                    if (id) {
                      update_recipe_by_pk();
                    } else {
                      insert_recipe_one();
                    }
                    setEditMode(false);
                  }
                : undefined
            }
            onCancelClick={isInEditMode ? () => setEditMode(false) : undefined}
            onEditClick={isInEditMode ? undefined : () => setEditMode(true)}
            onDeleteClick={delete_recipe_by_pk}
          />
        }
      />
      <CardContent>
        {macronutrients?.energy_kj ? (
          <AggregationChips
            energy_cal={macronutrients.energy_cal!}
            energy_kj={macronutrients.energy_kj!}
            proteins={macronutrients.proteins!}
            carbohydrates={macronutrients.carbohydrates!}
            fats={macronutrients.fats!}
          />
        ) : null}

        {isInEditMode ? (
          <TextField
            defaultValue={description || updatedDesc}
            type={"text"}
            onChange={(event: any) => setUpdatedDesc(event?.target?.value)}
            className={classes.editableDescription}
          />
        ) : (
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            className={classes.description}
          >
            {description}
          </Typography>
        )}
      </CardContent>
    </>
  );
};