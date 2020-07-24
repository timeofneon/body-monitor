import React, { useEffect, useState } from "react";
import {
  createStyles,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  TextField,
} from "@material-ui/core";
import { Trans } from "@lingui/react";
import { EditDeleteButtonGroup } from "../EditDeletButtonGroup";
import {
  Recipe_Item,
  useAddRecipeItemMutation,
  useDeleteRecipeItemByPkMutation,
  useFoodSelectFieldListingQuery,
  useUpdateRecipeItemByPkMutation,
} from "../../../../graphql/generated/graphql";
import { makeStyles } from "@material-ui/core/styles";
import { HARDCODED_U_ID } from "../AddMealDialog";

interface Props {
  recipe_id?: string;
  row: Partial<Recipe_Item>;
  mode?: "add" | "regularRow";
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      margin: theme.spacing(2),
    },
    foodCell: {
      width: 220,
    },
    weightInput: {
      maxWidth: 80,
    },
  })
);

// TODO: unify food selector across app

export const RecipeTableEditableRow = ({ recipe_id, row, mode }: Props) => {
  const [isInEditMode, setEditMode] = useState(false);

  const [updatedRowFood, setUpdatedRowFood] = useState(row?.food?.id);
  const [updatedRowWeight, setUpdatedRowWeight] = useState(row?.weight || 100);

  const { data } = useFoodSelectFieldListingQuery();

  const [update_recipe_item_by_pk] = useUpdateRecipeItemByPkMutation({
    onCompleted: () => setEditMode(false),
    onError: (props) => console.log("Failed to updated:", props.message),
  });

  const [delete_recipe_item_by_pk] = useDeleteRecipeItemByPkMutation({
    onCompleted: () => setEditMode(false),
  });

  const [incert_recipe_item_one] = useAddRecipeItemMutation({
    onError: (error) => console.log(error),
  });

  const classes = useStyles();

  useEffect(() => {
    if (mode === "add") {
      setEditMode(true);
    }
  }, [mode]);

  const foodById = data?.food.find((item) => item.id === updatedRowFood);
  const macronutrients = {
    energy_cal: (foodById?.energy_cal / 100) * updatedRowWeight,
    energy_kj: (foodById?.energy_kj / 100) * updatedRowWeight,
    proteins: (foodById?.proteins / 100) * updatedRowWeight,
    carbohydrates: (foodById?.carbohydrates / 100) * updatedRowWeight,
    fats: (foodById?.fats / 100) * updatedRowWeight,
  };

  return (
    <TableRow>
      {isInEditMode ? (
        <>
          <TableCell
            component="th"
            scope="row"
            className={classes.foodCell}
            children={
              data && (
                <Select
                  label={<Trans>Food</Trans>}
                  defaultValue={row?.food?.id || data?.food[0].id}
                  onChange={(event) =>
                    setUpdatedRowFood(event.target.value as any)
                  }
                >
                  {data?.food.map((food, key) => (
                    <MenuItem value={food.id} key={key}>
                      {food.name}
                    </MenuItem>
                  ))}
                </Select>
              )
            }
          />
          <TableCell
            component="th"
            scope="row"
            children={
              <TextField
                defaultValue={row?.weight || 100}
                type={"number"}
                onChange={(event: any) =>
                  setUpdatedRowWeight(event?.target?.value)
                }
                className={classes.weightInput}
              />
            }
          />
        </>
      ) : (
        <>
          <TableCell
            component="th"
            scope="row"
            children={row?.food?.name}
            className={classes.foodCell}
          />
          <TableCell component="th" scope="row" children={row?.weight} />
        </>
      )}
      <TableCell
        component="th"
        scope="row"
        children={
          <React.Fragment>
            {(isInEditMode || mode === "add"
              ? macronutrients.energy_cal
              : row?.energy_cal
            )?.toFixed(2)}
            &nbsp;|&nbsp;
            {(isInEditMode || mode === "add"
              ? macronutrients.energy_kj
              : row?.energy_kj
            )?.toFixed(2)}
          </React.Fragment>
        }
      />
      <TableCell
        component="th"
        scope="row"
        children={(isInEditMode || mode === "add"
          ? macronutrients.proteins
          : row?.proteins
        )?.toFixed(2)}
      />
      <TableCell
        component="th"
        scope="row"
        children={(isInEditMode || mode === "add"
          ? macronutrients.carbohydrates
          : row?.carbohydrates
        )?.toFixed(2)}
      />
      <TableCell
        component="th"
        scope="row"
        children={(isInEditMode || mode === "add"
          ? macronutrients.fats
          : row?.fats
        )?.toFixed(2)}
      />
      <TableCell
        component="th"
        scope="row"
        children={
          <EditDeleteButtonGroup
            onConfirmClick={
              isInEditMode
                ? mode === "add"
                  ? () =>
                      incert_recipe_item_one({
                        variables: {
                          recipe_id,
                          u_id: HARDCODED_U_ID,
                          food_id: updatedRowFood,
                          weight: updatedRowWeight,
                          ...macronutrients,
                        },
                      })
                  : () =>
                      update_recipe_item_by_pk({
                        variables: {
                          id: row.id,
                          food_id: updatedRowFood,
                          weight: updatedRowWeight,
                          ...macronutrients,
                        },
                      })
                : undefined
            }
            onCancelClick={
              isInEditMode && !(mode === "add")
                ? () => setEditMode(false)
                : undefined
            }
            onEditClick={
              isInEditMode && mode === "add"
                ? undefined
                : () => setEditMode(row.id)
            }
            onDeleteClick={
              !(mode === "add")
                ? () =>
                    delete_recipe_item_by_pk({
                      variables: { id: row.id },
                    })
                : undefined
            }
          />
        }
      />
    </TableRow>
  );
};