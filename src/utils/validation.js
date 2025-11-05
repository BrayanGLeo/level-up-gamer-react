export const validateEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@((duoc\.cl)|(profesor\.duoc\.cl)|(gmail\.com)|(admin\.cl))$/;
    return emailRegex.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
    if (!password) return false;
    return password.length >= 6;
};

export const validateLoginPassword = (password) => {
    if (!password) return false;
    return password.length >= 6;
};

export const validateRequiredField = (value, maxLength) => {
    if (!value || value.trim() === '') return false;
    if (maxLength && value.length > maxLength) return false;
    return true;
};

export const validateTextField = (value, maxLength) => {
    if (!value || value.trim() === '') return false;
    if (maxLength && value.length > maxLength) return false;
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(value);
};


// Valida el formato Y el dígito verificador
export const validateRut = (rutCompleto) => {
    if (!rutCompleto) return false;

    const rutLimpio = rutCompleto.replace(/\./g, '').replace('-', '');
    if (rutLimpio.length < 2) return false;

    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();

    if (!/^\d+$/.test(cuerpo)) return false;

    const primerDigito = cuerpo.charAt(0);
    const todosIguales = cuerpo.split('').every(char => char === primerDigito);
    if (todosIguales) {
        return false;
    }

    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += multiplo * parseInt(cuerpo.charAt(i), 10);
        if (multiplo === 7) multiplo = 2;
        else multiplo++;
    }
    const resto = suma % 11;
    const dvEsperado = 11 - resto;
    let dvCalculado;
    if (dvEsperado === 11) dvCalculado = '0';
    else if (dvEsperado === 10) dvCalculado = 'K';
    else dvCalculado = dvEsperado.toString();

    return dv === dvCalculado;
};

// Valida que el usuario sea mayor de 18 años.
export const validateBirthdate = (birthdate) => {
    if (!birthdate) return true;

    const birthDate = new Date(birthdate);
    const minDate = new Date('1900-01-01');
    const today = new Date();

    if (birthDate < minDate) {
        return false;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 18;
};

export const validatePhone = (phone) => {
    if (!phone) return false;
    const phoneRegex = /^(?:\+?56)?(?:\s?)(?:9\s?|09\s?|9)\s?[1-9]\d{3}\s?\d{4}$/;
    return phoneRegex.test(phone.trim());
};


// Validaciones de Formulario de Producto
export const validateProductForm = (product) => {
    const errors = {};

    if (!product.codigo) {
        errors.codigo = 'El código del producto es requerido.';
    } else if (product.codigo.length < 3) {
        errors.codigo = 'El código debe tener al menos 3 caracteres.';
    }

    if (!product.nombre) {
        errors.nombre = 'El nombre del producto es requerido.';
    } else if (product.nombre.length > 100) {
        errors.nombre = 'El nombre no debe exceder los 100 caracteres.';
    }

    if (product.precio === '' || product.precio === null) {
        errors.precio = 'El precio es requerido.';
    } else if (parseFloat(product.precio) < 0) {
        errors.precio = 'El precio no puede ser negativo.';
    }

    if (product.stock === '' || product.stock === null) {
        errors.stock = 'El stock es requerido.';
    } else if (!Number.isInteger(parseFloat(product.stock)) || parseInt(product.stock) < 0) {
        errors.stock = 'El stock debe ser un número entero igual o mayor a 0.';
    }

    if (!product.categoria) {
        errors.categoria = 'Debe seleccionar una categoría.';
    }

    return errors;
};

// Validaciones de Formulario de Usuario
export const validateUserForm = (user) => {
    const errors = {};

    if (!validateRut(user.run)) {
        errors.run = 'El RUN ingresado no es válido.';
    }

    if (!validateTextField(user.nombre, 30)) {
        errors.nombre = 'El nombre no puede estar vacio y solo debe contener letras y espacios (máx 30).';
    }

    if (!validateTextField(user.apellidos, 30)) {
        errors.apellidos = 'Los apellidos no puede estar vacio y solo debe contener letras y espacios (máx 30).';
    }

    if (!validateEmail(user.email)) {
        errors.email = 'El dominio del correo no es válido.';
    }

    if (!validateBirthdate(user.fechaNacimiento)) {
        errors.fechaNacimiento = 'La fecha debe ser válida (posterior a 1900) y debes ser mayor de 18 años.';
    }

    if (!validateRequiredField(user.direccion, 300)) {
        errors.direccion = 'La dirección es requerida (máx 300).';
    }

    if (!user.region) errors.region = 'Debe seleccionar una región.';
    if (!user.comuna) errors.comuna = 'Debe seleccionar una comuna.';
    if (!user.role) errors.role = 'Debe seleccionar un tipo de usuario.';

    return errors;
}