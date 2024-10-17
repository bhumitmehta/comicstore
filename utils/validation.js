const Joi = require('joi');

// Comic validation schema
const comicSchema = Joi.object({
    comicName: Joi.string()
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.base': 'Comic name must be a string',
            'string.empty': 'Comic name cannot be empty',
            'string.min': 'Comic name must be at least 1 characters long',
            'string.max': 'Comic name must be at most 255 characters long',
            'any.required': 'Comic name is required'
        }),
    authorName: Joi.string()
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.base': 'Author name must be a string',
            'string.empty': 'Author name cannot be empty',
            'string.min': 'Author name must be at least 3 characters long',
            'string.max': 'Author name must be at most 255 characters long',
            'any.required': 'Author name is required'
        }),
    yearOfPublication: Joi.number()
        .integer()
        .min(1900)
        .max(new Date().getFullYear())
        .required()
        .messages({
            'number.base': 'Year of publication must be a number',
            'number.integer': 'Year of publication must be an integer',
            'number.min': 'Year of publication must be after 1900',
            'number.max': `Year of publication cannot be in the future`,
            'any.required': 'Year of publication is required'
        }),
    noOfChapters: Joi.number()
        .integer()
        .min(0)
        .optional()
        .default(0)
        .messages({
            'number.base': 'Number of chapters must be a number',
            'number.integer': 'Number of chapters must be an integer',
            'number.min': 'Number of chapters cannot be negative'
        }),
    description: Joi.string()
        .max(1000)
        .optional()
        .messages({
            'string.base': 'Description must be a string',
            'string.max': 'Description must be at most 1000 characters long'
        }),
});

// Chapter validation schema
const chapterSchema = Joi.object({
    comic_id: Joi.number()
        .integer()
        .positive()
        .optional() // Make this optional, as comicName can be used instead
        .messages({
            'number.base': 'Comic ID must be a number',
            'number.integer': 'Comic ID must be an integer',
            'number.positive': 'Comic ID must be a positive number'
        }),
    comicName: Joi.string()
        .optional() // Make this optional as well
        .messages({
            'string.base': 'Comic name must be a string',
            'string.empty': 'Comic name cannot be empty'
        }),
    chapterTitle: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.base': 'Chapter title must be a string',
            'string.empty': 'Chapter title cannot be empty',
            'string.min': 'Chapter title must be at least 3 characters long',
            'string.max': 'Chapter title must be at most 255 characters long',
            'any.required': 'Chapter title is required'
        }),
    chapterNumber: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Chapter number must be a number',
            'number.integer': 'Chapter number must be an integer',
            'number.positive': 'Chapter number must be a positive number',
            'any.required': 'Chapter number is required'
        }),
    pages: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'Number of pages must be a number',
            'number.integer': 'Number of pages must be an integer',
            'number.min': 'Number of pages must be at least 1',
            'any.required': 'Number of pages is required'
        }),
    releaseDate: Joi.date()
        .optional()
        .messages({
            'date.base': 'Release date must be a valid date'
        }),
    description: Joi.string()
        .max(10000)
        .optional()
        .messages({
            'string.base': 'Description must be a string',
            'string.max': 'Description must be at most 1000 characters long'
        }),
    availableCopies: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .optional()
        .messages({
            'number.base': 'Available copies must be a number',
            'number.integer': 'Available copies must be an integer',
            'number.min': 'Available copies cannot be negative'
        }),
    chapterCondition: Joi.string()
        .valid('new', 'used')
        .required()
        .messages({
            'any.only': 'Chapter condition must be either "new" or "used"',
            'any.required': 'Chapter condition is required'
        }),
    price: Joi.number()
        .precision(2)
        .min(0)
        .required()
        .messages({
            'number.base': 'Price must be a number',
            'number.precision': 'Price must have at most 2 decimal places',
            'number.min': 'Price cannot be negative',
            'any.required': 'Price is required'
        }),
    discount: Joi.number()
        .precision(2)
        .min(0)
        .max(100)
        .optional()
        .messages({
            'number.base': 'Discount must be a number',
            'number.precision': 'Discount must have at most 2 decimal places',
            'number.min': 'Discount cannot be negative',
            'number.max': 'Discount cannot exceed 100',
        }),
}).xor('comic_id', 'comicName'); // Ensure at least one of the two is provided



const updateComicSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'ID must be a number',
            'number.integer': 'ID must be an integer',
            'number.positive': 'ID must be a positive number',
            'any.required': 'ID is required'
        }),
    comicName: Joi.string()
        .min(3)
        .max(255)
        .optional()
        .messages({
            'string.base': 'Book name must be a string',
            'string.empty': 'Book name cannot be empty',
            'string.min': 'Book name must be at least 3 characters long',
            'string.max': 'Book name must be at most 255 characters long'
        }),
    authorName: Joi.string()
        .min(3)
        .max(255)
        .optional()
        .messages({
            'string.base': 'Author name must be a string',
            'string.empty': 'Author name cannot be empty',
            'string.min': 'Author name must be at least 3 characters long',
            'string.max': 'Author name must be at most 255 characters long'
        }),
    yearOfPublication: Joi.number()
        .integer()
        .min(1900)
        .max(new Date().getFullYear())
        .optional()
        .messages({
            'number.base': 'Year of publication must be a number',
            'number.integer': 'Year of publication must be an integer',
            'number.min': 'Year of publication must be after 1900',
            'number.max': `Year of publication cannot be in the future`
        }),
    noOfChapters: Joi.number()
        .integer()
        .min(0)
        .optional()
        .messages({
            'number.base': 'Number of chapters must be a number',
            'number.integer': 'Number of chapters must be an integer',
            'number.min': 'Number of chapters cannot be negative'
        }),
    numberOfPages: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'Number of pages must be a number',
            'number.integer': 'Number of pages must be an integer',
            'number.positive': 'Number of pages must be a positive number'
        }),
    description: Joi.string()
        .max(1000)
        .optional()
        .messages({
            'string.base': 'Description must be a string',
            'string.max': 'Description must be at most 1000 characters long'
        }),
});


const updateChapterSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'ID must be a number',
            'number.integer': 'ID must be an integer',
            'number.positive': 'ID must be a positive number',
            'any.required': 'ID is required'
        }),
    chapterTitle: Joi.string()
        .max(255)
        .optional()
        .messages({
            'string.base': 'Chapter title must be a string',
            'string.empty': 'Chapter title cannot be empty',
            'string.max': 'Chapter title must be at most 255 characters long'
        }),
    chapterNumber: Joi.number()
        .integer()
        .optional()
        .messages({
            'number.base': 'Chapter number must be a number',
            'number.integer': 'Chapter number must be an integer'
        }),
    pages: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'Pages must be a number',
            'number.integer': 'Pages must be an integer',
            'number.positive': 'Pages must be a positive number'
        }),
    releaseDate: Joi.date()
        .optional()
        .messages({
            'date.base': 'Release date must be a valid date'
        }),
    description: Joi.string()
        .max(1000)
        .optional()
        .messages({
            'string.base': 'Description must be a string',
            'string.max': 'Description must be at most 1000 characters long'
        }),
    availableCopies: Joi.number()
        .integer()
        .min(0)
        .optional()
        .messages({
            'number.base': 'Available copies must be a number',
            'number.integer': 'Available copies must be an integer',
            'number.min': 'Available copies cannot be negative'
        }),
    chapterCondition: Joi.string()
        .valid('new', 'used')
        .optional()
        .messages({
            'string.base': 'Chapter condition must be a string',
            'any.only': 'Chapter condition must be either "new" or "used"'
        }),
    price: Joi.number()
        .precision(2)
        .optional()
        .messages({
            'number.base': 'Price must be a number',
            'number.precision': 'Price must have at most 2 decimal places'
        }),
    discount: Joi.number()
        .precision(2)
        .optional()
        .messages({
            'number.base': 'Discount must be a number',
            'number.precision': 'Discount must have at most 2 decimal places'
        }),
});

// Utility function to validate update chapter data
const validateUpdateChapter = (updateData) => {
    return updateChapterSchema.validate(updateData);
};

// Utility function to validate update comic data
const validateUpdateComic = (updateData) => {
    return updateComicSchema.validate(updateData);
};

// Utility function to validate comic data
const validateComic = (comicData) => {
    return comicSchema.validate(comicData);
};

// Utility function to validate chapter data
const validateChapter = (chapterData) => {
    return chapterSchema.validate(chapterData);
};

module.exports = {
    validateComic,
    validateChapter,
    validateUpdateComic,
    validateUpdateChapter
};
