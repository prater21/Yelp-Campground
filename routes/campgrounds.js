/**
 * campgrounds routes
 */
const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampgrond } = require('../middleware');

//for uploads img files
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage }) //이미지 저장하는 데스티네이션인가봄??


//show all campgrounds
router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds });
})

//add new campground
router.post('/', isLoggedIn, upload.array('image'), validateCampgrond, async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
})

//show new campground form
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})


//show each campground
router.get('/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
})

//edit campground form submit
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampgrond, async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${id}`);
})

//delete campground
router.delete("/:id", isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect(`/campgrounds`);
})

//edit campground
router.get('/:id/edit', isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
})

module.exports = router;