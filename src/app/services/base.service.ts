import { Injectable } from '@angular/core';
import { Observable, Observer, timer, throwError, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { mergeMap, finalize, retryWhen, catchError, filter } from 'rxjs/operators';

export class DataBaseServiceResponse<K> {
  code: number;
  entity: K;
  message?: string;
  serverResponse: any;
  error?: boolean;
}

export class ServiceLoopbackFilters {
  /**
   * A fields filter specifies properties (fields) to include or exclude from the results.
   * Accepts an object {property: true, property2: false},  when if`s true, then includes in the response, and false, ignore it.
   * @example {property: true, property2: false}
   */
  fields?: any[];
  /**
   * An include filter enables you to include results from related models in a query,
   * for example models that have belongsTo or hasMany relations, to optimize the number of requests.
   * @description The value of the include filter can be a string, an array, or an object.
   * @example {include: 'relatedModel'}
   * @example {include: ['relatedModel1', 'relatedModel2', ...]}
   * @example {include: {relatedModel1: [{relatedModel2: 'relationName'} , 'relatedModel']}}
   */
  include?: string | string[] | any | any[];
  /**
   * A limit filter limits the number of records returned to the specified number (or less).
   * @example { limit: 5 }
   */
  limit?: number;
  /**
   * An order filter specifies how to sort the results: ascending (ASC) or descending (DESC) based on the specified property.
   * @example { order: 'propertyName <ASC|DESC>' }
   * @example { order: ['propertyName <ASC|DESC>', 'propertyName <ASC|DESC>',...] }
   */
  order?: string | string[];
  /**
   * A skip filter omits the specified number of returned records. This is useful, for example, to paginate responses.
   * @example {skip: n}
   * @example {skip: 10}
   */
  skip?: number;
  /**
   * A where filter specifies a set of logical conditions to match, similar to a WHERE clause in a SQL query.
   *
   * @example {where: {property: value}}
   * @example {where: {carClass:'fullsize'}}
   * @example {where: {property: {op: value}}}
   * @tutorial op is one of the operators listed below.
   * @tutorial = -> Equivalence
   * @tutorial and -> Logical AND operator.
   * @tutorial or -> Logical OR operator.
   * @tutorial gt, gte -> Numerical greater than (>); greater than or equal (>=). Valid only for numerical and date values.
   * @tutorial lt, lte -> Numerical less than (<); less than or equal (<=). Valid only for numerical and date values.
   * For geolocation values, the units are in miles by default
   * @tutorial between -> True if the value is between the two specified values: greater than or equal to
   * first value and less than or equal to second value.
   * @tutorial inq, nin -> In / not in an array of values.
   * @tutorial near -> For geolocations, return the closest points, sorted in order of distance.
   * Use with limit to return the n closest points.
   * @tutorial neq -> Not equal (!=)
   * @tutorial like, nlike -> LIKE / NOT LIKE operators for use with regular expressions.
   * The regular expression format depends on the backend data source.
   * @tutorial like, nlike, options: i -> LIKE / NOT LIKE operators for use with regular expressions with the case
   * insensitive flag. It is supported by the memory and MongoDB connectors. The options property set to ‘i’
   * tells LoopBack that it should do case-insensitive matching on the required property.
   * @tutorial ilike, nilike -> ILIKE / NOT ILIKE operators for use with regular expressions.
   * The operator is supported only by the memory and Postgresql connectors.
   * @tutorial regexp -> Regular expression.
   *
   * @example For examples see
   * @see https://loopback.io/doc/en/lb3/Where-filter.html
   *
   */
  where?: any;
}

export class ServiceRetryStrategy {
  /**
   * Scaling factor to retry;
   * @example {scalingFactor: 2}
   * 1s, 2s, 4s, 8s, 16s, n*2
   * @example {scalingFactor: 1}
   * 1s, 1s, 1s, 1s, 1s, n*1
   *
   */
  scalingFactor: number;
  /**
   * Max attempts to a successfuly request
   * @example {maxRetryAttempts: 3}
   */
  maxRetryAttempts: number;
  /**
   * Excluded status code to retry.
   * @todo If an item has 1 digit, will exclude all status codes than starts with that digit.
   *
   *
   * @example
   * {excludedStatusCodes: [200]}
   * -> Will Exclude retries for code 200
   * @example
   * {excludedStatusCodes: [200, 301]}
   * -> Will Exclude retries for codes 200 and 301
   * @example
   * {excludedStatusCodes: [2]}
   * -> Will Excludes all codes 2XX
   */
  excludedStatusCodes?: number[] = [];
}

export const retryStrategy = (retryStrategyObject: ServiceRetryStrategy) => {
  return (attempts: Observable<any>) => {
    return attempts.pipe(
      mergeMap((error, i) => {
        const retryAttempt = i + 1;
        const retrySet = (retryStrategyObject.scalingFactor ** (i + 1));
        // if maximum number of retries have been met
        // or response is a status code we don't wish to retry, throw error
        if (
          retryAttempt > retryStrategyObject.maxRetryAttempts ||
          retryStrategyObject.excludedStatusCodes.find(e => e === error.status)
        ) {
          return throwError(error);
        }
        /* console.log(
          `Attempt ${retryAttempt}: retrying in ${retrySet}s`
        ); */
        // retry after 1s, 2s, etc...
        return timer(retrySet * 1000);
      }),
      // finalize(() => console.log('Finish Request'))
    );
  };
};

const defaultHttpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};
const defaultRetryStrategyObject: ServiceRetryStrategy = { excludedStatusCodes: [], maxRetryAttempts: 0, scalingFactor: 1};

@Injectable({
  providedIn: 'root'
})
export class BaseService<T> {

  private  setFilters = (filters: ServiceLoopbackFilters, httpOptions: object, isCount: boolean = false) => {
    const options: any = {...httpOptions};
    options.params = options.params === void 0 ? {} : options.params;
    // console.log(filters, isCount && filters.where !== void 0, isCount);
    if (isCount) {
      options.params.where = JSON.stringify(filters);
    } else {
      options.params.filter = JSON.stringify(filters);
    }
    return options;
  }

  constructor(private httpClient: HttpClient) { }

  get(path: string,
      filters?: ServiceLoopbackFilters | any,
      authorization?: string,
      httpOptions?: any ,
      retryStrategyObject?: ServiceRetryStrategy,
      isCount: boolean = false
    ): Observable<DataBaseServiceResponse<T>> {
    return Observable.create((observer: Observer< DataBaseServiceResponse <T> >) => {
      filters = filters === void 0 ? {} : filters;
      retryStrategyObject = retryStrategyObject === void 0 ? defaultRetryStrategyObject : retryStrategyObject;
      httpOptions = httpOptions === void 0 ? {} : httpOptions;
      httpOptions['observe'] = 'response';
      if (authorization !== void 0 && authorization.length > 0) {
        httpOptions.headers = httpOptions.headers === void 0 ? {} : httpOptions.headers;
        httpOptions.headers['Authorization'] = authorization;
      }
      // If the get request is to "count", sent only where filter
      httpOptions = this.setFilters(filters, httpOptions, isCount);
      // console.log('HTTP OPTIONS', httpOptions);
      this.httpClient.get(path, httpOptions)
      .pipe(retryWhen(retryStrategy(retryStrategyObject)), catchError(error => of(error))).subscribe((response) => {
        // console.log(response);
        observer.next({ error: !response.ok, code: response.status, message: response.message || response.statusText,
          serverResponse: response, entity: response.body });
        observer.complete();
      });
    });
  }

  post(
    path: string,
    entity: T,
    filters?: ServiceLoopbackFilters,
    authorization?: string,
    httpOptions?: any ,
    retryStrategyObject?: ServiceRetryStrategy
  ): Observable<DataBaseServiceResponse<T>> {
    return Observable.create((observer: Observer< DataBaseServiceResponse <T> >) => {
      filters = filters === void 0 ? {} : filters;
      retryStrategyObject = retryStrategyObject === void 0 ? defaultRetryStrategyObject : retryStrategyObject;
      httpOptions = httpOptions === void 0 ? {} : httpOptions;
      httpOptions['observe'] = 'response';
      if (authorization !== void 0 && authorization.length > 0) {
        httpOptions.headers = httpOptions.headers === void 0 ? {} : httpOptions.headers;
        httpOptions.headers['Authorization'] = authorization;
      }
      httpOptions = this.setFilters(filters, httpOptions);
      this.httpClient.post(path, entity , httpOptions)
      .pipe(retryWhen(retryStrategy(retryStrategyObject)), catchError(error => of(error))).subscribe((response) => {
        // console.log(response);
        observer.next({ error: !response.ok, code: response.status, message: response.message || response.statusText,
          serverResponse: response, entity: response.body });
        observer.complete();
      });
    });
  }

  put(
    path: string,
    entity: T,
    filters?: ServiceLoopbackFilters,
    authorization?: string,
    httpOptions?: any ,
    retryStrategyObject?: ServiceRetryStrategy
  ): Observable<DataBaseServiceResponse<T>> {
    return Observable.create((observer: Observer< DataBaseServiceResponse <T> >) => {
      filters = filters === void 0 ? {} : filters;
      retryStrategyObject = retryStrategyObject === void 0 ? defaultRetryStrategyObject : retryStrategyObject;
      httpOptions = httpOptions === void 0 ? {} : httpOptions;
      httpOptions['observe'] = 'response';
      if (authorization !== void 0 && authorization.length > 0) {
        httpOptions.headers = httpOptions.headers === void 0 ? {} : httpOptions.headers;
        httpOptions.headers['Authorization'] = authorization;
      }
      httpOptions = this.setFilters(filters, httpOptions);
      this.httpClient.put(path, entity , httpOptions)
      .pipe(retryWhen(retryStrategy(retryStrategyObject)), catchError(error => of(error))).subscribe((response) => {
        // console.log(response);
        observer.next({ error: !response.ok, code: response.status, message: response.message || response.statusText,
          serverResponse: response, entity: response.body });
        observer.complete();
      });
    });
  }

  patch(
    path: string,
    entity: T,
    filters?: ServiceLoopbackFilters,
    authorization?: string,
    httpOptions?: any ,
    retryStrategyObject?: ServiceRetryStrategy
  ): Observable<DataBaseServiceResponse<T>> {
    return Observable.create((observer: Observer< DataBaseServiceResponse <T> >) => {
      filters = filters === void 0 ? {} : filters;
      retryStrategyObject = retryStrategyObject === void 0 ? defaultRetryStrategyObject : retryStrategyObject;
      httpOptions = httpOptions === void 0 ? {} : httpOptions;
      httpOptions['observe'] = 'response';
      if (authorization !== void 0 && authorization.length > 0) {
        httpOptions.headers = httpOptions.headers === void 0 ? {} : httpOptions.headers;
        httpOptions.headers['Authorization'] = authorization;
      }
      httpOptions = this.setFilters(filters, httpOptions);
      this.httpClient.patch(path, entity , httpOptions)
      .pipe(retryWhen(retryStrategy(retryStrategyObject)), catchError(error => of(error))).subscribe((response) => {
        // console.log(response);
        observer.next({ error: !response.ok, code: response.status, message: response.message || response.statusText,
          serverResponse: response, entity: response.body });
        observer.complete();
      });
    });
  }

  delete(
    path: string,
    filters?: ServiceLoopbackFilters,
    authorization?: string,
    httpOptions?: any ,
    retryStrategyObject?: ServiceRetryStrategy
  ): Observable<DataBaseServiceResponse<T>> {
    return Observable.create((observer: Observer< DataBaseServiceResponse <T> >) => {
      filters = filters === void 0 ? {} : filters;
      retryStrategyObject = retryStrategyObject === void 0 ? defaultRetryStrategyObject : retryStrategyObject;
      httpOptions = httpOptions === void 0 ? {} : httpOptions;
      httpOptions['observe'] = 'response';
      if (authorization !== void 0 && authorization.length > 0) {
        httpOptions.headers = httpOptions.headers === void 0 ? {} : httpOptions.headers;
        httpOptions.headers['Authorization'] = authorization;
      }
      httpOptions = this.setFilters(filters, httpOptions);
      this.httpClient.delete(path , httpOptions)
      .pipe(retryWhen(retryStrategy(retryStrategyObject)), catchError(error => of(error))).subscribe((response) => {
        // console.log(response);
        observer.next({ error: !response.ok, code: response.status, message: response.message || response.statusText,
          serverResponse: response, entity: response.body });
        observer.complete();
      });
    });
  }

}
