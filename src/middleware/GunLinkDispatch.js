import { ApolloLink, Operation, FetchResult, Observable } from "apollo-link";
//import * from 'Gun'
import { ProcessRequest } from "./GunMiddleware";
import  gun  from "../gundb";

//export namespace GunLinkDispatch {
  // export type ResolverContextFunction = (
  //   operation: Operation
  // ) => Record<string, any>;

  // export interface Options {
  //   /**
  //    * The schema to generate responses from.
  //    */
  //   schema: any;

  //   gun: any;
  // }
//}

export class GunLinkDispatch extends ApolloLink {
  // public schema: any;
  // public gun: any;

  constructor({ gun }) {
    super();

    //this.schema = schema;
    this.gun = gun;
  }

  // request(operation, forward) {
  //   var result = (async () => {
  //       return await ProcessRequest(operation, this.gun);
  //     });
  //   return result;
  // }

  request(operation, forward) {
      return LocalQuery(operation);
  }  // End Request
} // End class

//export default GunLinkDispatch;

export const LocalQuery = (operation) => {
    return new Observable(observer => {
        ProcessRequest(operation, gun).then(result => {
            observer.next( {data : result } );
            observer.complete();
        }); // End ProcessRequest
    }); // End Observable
}


    //   // TODO: check schema
    //   (async () => {
    //     try {
    //       console.log(operation.query);
    //       let result = await ProcessRequest(operation, this.gun);
    //       //for await (const data of await ProcessRequest(operation, this.gun) ) {
    //       //    if (!observer.closed) {
    //       //      observer.next({ data });
    //       //    }
    //       //  }
    //       if (!observer.closed) 
    //         observer.next( {data : result } );
          
    //       observer.complete();
    //     } catch (e) {
    //       if (!observer.closed) {
    //         observer.error(e);
    //       }
    //     }
    //   })();
    // });
