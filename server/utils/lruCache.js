class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if(!this.cache.has(key)) {
            return null; 
        }
        else {
            const value = this.cache.get(key);
            // if found, move to the "most recently used" position
            this.cache.delete(key);
            this.cache.set(key, value);

            return value;
        }
    }

    put(key, value) {
        // if key exists, remove it first
        if(this.cache.has(key)) {
            this.cache.delete(key);
        }
        // if at capacity, evict the least recently used
        else if(this.cache.size >= this.capacity) {
            const lruKey = this.cache.keys().next().value; // gets first key (least recently used)
            this.cache.delete(lruKey);
        }
        
        // adds new key/value
        this.cache.set(key, value);
    }

    invalidate(key) {
        // remove a key when a url gets deleted
        this.cache.delete(key);
    }
}

module.exports = new LRUCache(500);

