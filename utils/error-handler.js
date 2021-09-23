module.exports = errorHandler;

function errorHandler(err, req, res, next) {
	console.error(err)
	if (typeof (err) === 'string') {
		// Error de aplicación presonalizada
		return res.status(400).json({ message: err });
	}

	if (err.name === 'ValidationError') {
		// Error de validación de Mongoose
		return res.status(400).json({ message: err.message });
	}

	if (err.name === 'UnauthorizedError') {
		// Error de autenticación JWT
		return res.status(401).json({ message: 'Invalid Token' });
	}

	// Por defecto Error del servidor
	return res.status(500).json({ message: err.message });
}
