const router = require('express').Router();
const Url = require('../models/Url');
const cache = require('../utils/lruCache');

// redirect to big url
router.get('/:code', async (req, res) => {
    const { code } = req.params;
    
    try {
        // check lru cache
        const cached = cache.get(code);

        if (cached) {
            Url.findOneAndUpdate({ babyCode: code }, { 
                $inc: { clickCount: 1 }, // increment click count
                $push: { clicks: { timestamp: new Date() } } // add click timestamp
            }).exec();

            return res.redirect(301, cached); // redirect to big url
        }

        // if not in cache, look up in database
        const url = await Url.findOne({ babyCode: code });
        if (!url) {
            return res.status(404).json({ error: 'URL not found.' });
        }

        if (url.expiresAt && url.expiresAt < new Date()) {
            return res.status(410).json({ error: 'this baby url has expired :(' });
        }

        // add to cache
        cache.put(code, url.bigUrl);

        // increment click count and add click timestamp
        Url.findByIdAndUpdate(url._id, { 
            $inc: { clickCount: 1 },
            $push: { clicks: { timestamp: new Date() } }
        }).exec();

        // redirect to big url
        return res.redirect(301, url.bigUrl);
    }
    catch (err){
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;