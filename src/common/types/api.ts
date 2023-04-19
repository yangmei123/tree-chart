/**
 * 通用的接口错误返回值类型
 */
export interface FailureResponse {
  code: number;
  message: string;
  data?: any;
}

/**
 * 通用的接口正确返回值类型
 */
export interface SuccessResponse<T> {
  code: 0;
  message?: string;
  data: T;
}

/**
 * 接口返回值类型
 */
export type ApiResponse<T> = FailureResponse | SuccessResponse<T>;

/**
 * 错误类型
 */
export type ResponseError = Error | FailureResponse;

/**
 * 基础的请求类型
 */
export type BaseService = (...args: any[]) => Promise<ApiResponse<any>>;

/**
 * 基础的列表请求类型
 */
export type BaseListService = (
  params: Partial<PaginationRequestParams & Record<string, any>>,
) => Promise<ApiResponse<PaginationResponseData<any>>>;

/**
 * 通用的列表请求相关参数
 */
export interface PaginationRequestParams {
  page: number;
  page_size: number;
}

/**
 * 通用的列表接口返回值里的data的类型
 */
export interface PaginationResponseData<T> {
  page?: number;
  count?: number;
  list: T[];
}

/**
 * 通用的详情接口返回值里的data的类型
 */
export interface DetailResponseData<T> {
  detail: T;
}

/**
 * 基础的详情请求类型
 */
export type BaseDetailService = (params: any) => Promise<ApiResponse<any>>;

/**
 * 根据一个service，获取SuccessResponse里的data
 */
export type PickSuccessResponseData<
  T extends BaseService | BaseListService | BaseDetailService,
> = T extends BaseService | BaseDetailService
  ? Awaited<ReturnType<T>> extends ApiResponse<infer U>
    ? U
    : never
  : T extends BaseListService
  ? Awaited<ReturnType<T>> extends ApiResponse<PaginationResponseData<infer V>>
    ? V
    : never
  : never;
