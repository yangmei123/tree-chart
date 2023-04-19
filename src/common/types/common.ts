import type { IRoute } from 'umi';

/**
 * 继承一下路由配置的类型
 */
export interface MyRoute extends IRoute {
  shouldTranslate?: boolean;
  routes?: MyRoute[];
}

/**
 * 获取OSS签名的的参数
 */
export interface OssTokenRequestParams {
  names: string;
  upload_type: 2;
}

/**
 * 获取OSS签名的返回值
 */
export interface OssTokenResponseData {
  AccessKeyId: string;
  AccessKeySecret: string;
  Expiration: string;
  SecurityToken: string;
  bucketName: string;
  domain: string;
  endpoint: string;
  signature: {
    expire: string;
    policy: string;
    signature: string;
  };
}

/**
 * 通用定义列表里返回值的通用类型
 */
export interface CommonEnumTypesValue {
  key?: string;
  id: string;
  name: string;
}

export type CommonEnumResult<T extends keyof CommonEnumTypesMap> = Record<
  T,
  CommonEnumTypesMap[T][]
>;

export interface CommonEnumTypesMap {
  category_list: CommonEnumTypesValue;
  type_list: CommonEnumTypesValue;
}
