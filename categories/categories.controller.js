const express = require('express');
const router = express.Router();
const categoryService = require('./categories.service');

const getAllCategories = (req, res, next) => {
    console.log(req.baseUrl);
    categoryService.getAllCategories()
        .then(categories => res.json(categories))
        .catch(err => next(err));
};

const getCategoryById = (req, res, next) => {
    categoryService.getCategoryById(req.params.id)
        .then(categories => res.json(categories))
        .catch(err => next(err));
};

const getCategoryByName = (req, res, next) => {
    categoryService.getCategoryByName(req.params.name)
        .then(categories => res.json(categories))
        .catch(err => next(err));
};

const addCategory = (req, res, next) => {
    categoryService.addCategory(req.body)
        .then(categories => res.json(categories))
        .catch(err => next(err));
};

const updateCategory = (req, res, next) => {
    categoryService.updateCategory(req.params.id, req.body)
        .then(categories => res.json(categories))
        .catch(err => next(err));
};

const deleteCategory = (req, res, next) => {
    categoryService.deleteCategory(req.params.id)
        .then(categories => res.json(categories))
        .catch(err => next(err));
};

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.get('/match/:name', getCategoryByName);
router.post('/', addCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;