const pool = require('../db/connectDB')();

class FeaturedImageController {

    static fetchAll = async (req, res) => {
        try {
            const productId = req.params.id
            const [data] = await pool.query('SELECT * FROM featured_images WHERE productId = ?', [productId]);
            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }
}

module.exports = FeaturedImageController;