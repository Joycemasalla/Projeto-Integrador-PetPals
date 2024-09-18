// Cria um middleware para lidar com erros assíncronos
export const catchAsyncErros = (theFunction) => {
    return (req, res, next) => {
        // Se ocorrer um erro, ele será capturado e passado para o próximo middleware de tratamento de erros
        Promise.resolve(theFunction(req, res, next)).catch(next);
    };
};
