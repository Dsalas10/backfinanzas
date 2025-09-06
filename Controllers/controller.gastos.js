

const GastoModelo= require("../Models/model.gastos")
const UsuarioModelo= require("../Models/model.user")

// Crear un nuevo gasto
async function crearGasto(fecha, concepto, monto, usuarioId) {
    try{
        const usuario=await UsuarioModelo.findById(usuarioId);
        if(!usuario){
            return {mensaje:'Usuario no encontrado'};
        }
        const nuevoGasto=new GastoModelo({fecha,concepto,monto,usuario})
        await nuevoGasto.save();
        return {mensaje:'Gasto creado exitosamente', gasto:nuevoGasto};
    } catch (error) {
        return {mensaje:'Error al crear el gasto', error:error.message};
    }   
}

// Obtener todos los gastos de un usuario
async function obtenerGastosMesActual(usuarioId) {
    try{
        const inicioMes=new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const finMes=new Date(new Date().getFullYear(), new Date().getMonth()+1, 0, 23, 59, 59);
        const usuario=await UsuarioModelo.findById(usuarioId);
        if(!usuario){
            return {mensaje:'Usuario no encontrado'};
        }
        const gastos = await GastoModelo.find({  
            usuario,
            fecha: { $gte: inicioMes, $lte: finMes }
        }).sort({fecha:-1});
        return {gastos};
    } catch (error) {
        return {mensaje:'Error al obtener los gastos', error:error.message};
    }   
}

// Actualizar un gasto
async function actualizarGasto(gastoId, datosActualizados) {
    try{
        const gastoActualizado = await Gastos.findByIdAndUpdate(gastoId, datosActualizados, { new: true });
        return {mensaje:'Gasto actualizado exitosamente', gasto:gastoActualizado};
    } catch (error) {
        return {mensaje:'Error al actualizar el gasto', error:error.message};
    }   
}

// Eliminar un gasto
async function eliminarGasto(gastoId) {
    try{
        await Gastos.findByIdAndDelete(gastoId);
        return {mensaje:'Gasto eliminado exitosamente'};
    } catch (error) {
        return {mensaje:'Error al eliminar el gasto', error:error.message};
    }   
}

module.exports={crearGasto,obtenerGastosMesActual,actualizarGasto,eliminarGasto};
