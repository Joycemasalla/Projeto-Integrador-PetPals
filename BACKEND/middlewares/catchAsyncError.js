// Cria um middleware para lidar com erros assíncronos
export const catchAsyncErros = (theFunction) => {
    // Retorna uma função middleware que captura e lida com erros assíncronos
    return (req, res, next) => {
        // Executa a função assíncrona e passa o req, res, next para ela
        // Se ocorrer um erro, ele será capturado e passado para o próximo middleware de tratamento de erros
        Promise.resolve(theFunction(req, res, next)).catch(next);
    };
};
