const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoriesData = await Category.findAll();
    // ({
    //   include: [{ model: Product }],
    // });
    res.status(200).json(categoriesData);
  } catch (err) {
    // res.status(500).json(err);
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Internal server error" });
  }

});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!categoryData) {
      res.status(404).json({ message: 'Category not found with this id' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }

});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const updatedCategory = await Category.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updatedCategory[0]) {
      res.status(404).json({ message: 'Category not found with this id' });
      return;
    }
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).json(err);
  }

});

router.delete('/:id', async (req, res) => {
  // Delete associated products first
  try {
    await Product.destroy({ where: { category_id: req.params.id } });
  } catch (err) {
    // Handle any errors that occur while deleting associated products
    return res.status(500).json(err);
  }

  // Once associated products are deleted, delete the category itself
  try {
    const deletedCategory = await Category.destroy({
      where: { id: req.params.id },
    });
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found with this id' });
    }
    res.status(200).json(deletedCategory);
  } catch (err) {
    // Handle errors that occur while deleting the category
    res.status(500).json(err);
  }
});


module.exports = router;
