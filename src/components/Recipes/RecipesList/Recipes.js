import Recipe from "./Recipe";
import classes from './Recipes.module.css';
import useHttp from "../../../hooks/use-http";
import {useContext, useEffect, useState} from "react";
import AuthContext from "../../../store/auth-context";
import LoadingSpinner from "../../../UI/LoadingSpinner";
import Error from "../../../UI/Error";
import CustomButton from "../../../UI/CustomButton";
import {useHistory} from "react-router-dom";

const Recipes = () => {
    const {isLoading, errorMessage, sendRequest: getRecipes} = useHttp();
    const authContext = useContext(AuthContext);
    const token = authContext.token;
    const [recipes, setRecipes] = useState([]);
    const history = useHistory();

    const receiveData = (data) => {
        const loadedRecipes = [];
        for (const key in data) {
            loadedRecipes.push({
                id: key,
                name: data[key].name,
                desc: data[key].desc,
                img: data[key].img,
                diff: data[key].diff,
                hours: data[key].hours,
                minutes: data[key].minutes,
                preparation: data[key].preparation,
                ingredients: data[key].ingredients
            })
        }
        setRecipes(loadedRecipes);
    };

    useEffect(() => {
            getRecipes({
                url: `https://recipes-app-32684-default-rtdb.firebaseio.com/recipes.json?auth=${token}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }, receiveData);
        },
        [getRecipes, token])

    const addRecipeHandler = () => {
        history.replace('/newRecipe');
    }

    return (
        <section>
            <header className={classes.header}>
                <h4>Public recipes</h4>
                    <CustomButton onClick={addRecipeHandler} className={classes['recipes__button--add']}>Add new recipe</CustomButton>
                {isLoading && <LoadingSpinner/>}
                {errorMessage && <Error errorMessage={errorMessage}/>}
            </header>
            <div className={classes.recipes__list}>
                {recipes && recipes.map((recipe) => (
                    <Recipe key={recipe.id} recipe={recipe}/>
                ))}
            </div>
        </section>
    )
}

export default Recipes;