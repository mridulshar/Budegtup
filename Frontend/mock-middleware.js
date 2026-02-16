module.exports = (req, res, next) => {
    if (req.method === 'POST' && req.path === '/auth/password/login') {
        res.json({
            token: "mock-jwt-token-12345",
            user: {
                id: "1",
                name: "Test User",
                email: req.body.email || "test@example.com"
            }
        });
    } else if (req.method === 'POST' && req.path === '/auth/google') {
        res.json({
            token: "mock-google-token-67890",
            user: {
                id: "2",
                name: "Google User",
                email: "google@example.com",
                picture: "https://via.placeholder.com/150"
            }
        });
    } else {
        next();
    }
}
