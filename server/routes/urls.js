const router = require('express').Router();
const Url = require('../models/Url');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { getBabyCode } = require('../utils/keyPool');
const cache = require('../utils/lruCache');

// create new baby url
router.post('/', optionalAuth, async (req, res) => {
    try {
        const { bigUrl, alias, expiresAt } = req.body;

        if (!bigUrl) {
            return res.status(400).json({ error: 'Big URL is required.' });
        }

        let babyCode;
        if (alias) {
            // if alias exists, use it as the short code
            const existingUrl = await Url.findOne({ babyCode: alias });

            // alias collision check
            if (existingUrl) {
                return res.status(400).json({ error: 'Alias already in use.' });
            }

            babyCode = alias;
        } 
        else {
            babyCode = getBabyCode();
        }

        // save new url to database
        const newUrl = await Url.create({
            bigUrl, 
            babyCode,
            alias: alias || undefined, // only sets alias if it exists
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            owner: req.user?.id || null
        });
        // send back saved url
        res.status(201).json(newUrl);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get url
router.get('/', requireAuth, async (req, res) => {
    try {
        const urls = await Url.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.json(urls);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// delete url
router.delete('/:code', requireAuth, async (req, res) => {
    try {
        const url = await Url.findOne({ babyCode: req.params.code });

        if(!url) {
            return res.status(404).json({ error: 'URL not found.' });
        }

        // prevent users from deleting urls that aren't theirs
        if(url.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: 'That\'s not your URL gang.' });
        }

        // delete da url
        await url.deleteOne();
        cache.invalidate(req.params.code); // invalidate cache on delete
        res.json({ message: 'URL successfully deleted!'});
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// analytics route
router.get('/:code/analytics', requireAuth, async (req, res) => {
    try {
        const url = await Url.findOne({ babyCode: req.params.code });

        if(!url) {
            return res.status(404).json({ error: 'URL not found.' });   
        }

        // prevent users from viewing analytics of urls that aren't theirs
        if(url.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: 'That\'s not your URL gang.' });
        }

        // return analytics
        res.json({
            totalClicks: url.clickCount,
            bigUrl: url.bigUrl,
            babyUrl: url.babyCode,
            createdAt: url.createdAt,
            expiresAt: url.expiresAt,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;