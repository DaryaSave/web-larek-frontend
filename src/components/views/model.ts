import {IEvents} from "../base/events"; 

// Гарда для проверки на модель 
export const isModel = (obj: unknown): obj is Model<unknown> => { 
    return obj instanceof Model; 
} 

/** 
 * Базовая модель, чтобы можно было отличить ее от простых объектов с данными 
 */ 

export abstract class Model<T> { 
    constructor(data: Partial<T>, protected events: IEvents) { 
     Object.assign(this, data); 
   }
    emitChanges(event: string, payload?: object) { 
     this.events.emit(event, payload ?? {}); 
    } 
} 