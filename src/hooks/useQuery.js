// import { useState, useEffect, useMemo } from 'react';
// import { ApolloLink, Operation, FetchResult, Observable } from "apollo-link";
// //import gql from "graphql-tag";
// //import { LocalQuery } from '../middleware/GunLinkDispatch'
// import { ProcessRequest } from '../middleware/GunMiddleware'
// import  gun  from "../gundb";


// export const useQuery = (ql, variables) => {
//     const [data, setData] = useState();

//     let operation = { operationName: ql.definitions[0].name.value, variables: variables };

//     let dataMemo = useMemo(() => (ProcessRequest(operation).then(value => { setData(value); })), data);
//     // ProcessRequest(operation, gun).then(value => {
//     //     setData(value);
//     // });
//     // LocalQuery(operation).subscribe(value => {
//     //     setData(value);
//     // });

//     let loading = false;
//     if (dataMemo === undefined) {
//         loading = true;
//     }
//     return {dataMemo, loading};
// }