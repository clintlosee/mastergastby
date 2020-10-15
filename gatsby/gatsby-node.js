import path from 'path';

async function turnPizzasIntoPages({ graphql, actions }) {
  //* Get a template for this page
  const pizzaTemplate = path.resolve('./src/templates/Pizza.js');
  //* Query all pizzas
  const { data } = await graphql(`
    query {
      pizzas: allSanityPizza {
        nodes {
          name
          slug {
            current
          }
        }
      }
    }
  `);
  //* Loop over each pizza and create a page for that pizza
  data.pizzas.nodes.forEach((pizza) => {
    actions.createPage({
      path: `pizza/${pizza.slug.current}`,
      component: pizzaTemplate,
      context: {
        slug: pizza.slug.current,
      },
    });
  });
}

async function turnToppingsIntoPages({ graphql, actions }) {
  //* Get the template
  const toppingTemplate = path.resolve('./src/pages/pizzas.js');
  //* Query all the toppings
  const { data } = await graphql(`
    query {
      toppings: allSanityTopping {
        nodes {
          name
          id
        }
      }
    }
  `);
  //* createPage for that topping
  data.toppings.nodes.forEach((topping) => {
    actions.createPage({
      path: `topping/${topping.name}`,
      component: toppingTemplate,
      context: {
        topping: topping.name,
        toppingRegex: `/${topping.name}/i`,
      },
    });
  });
  //* pass the topping data to pizza.js
}

export async function createPages(params) {
  //* Create pages dynamically
  //* Pizzas
  await Promise.all([
    await turnPizzasIntoPages(params),
    await turnToppingsIntoPages(params),
  ]);
  //* Toppings
  //* Slicemasters
}
