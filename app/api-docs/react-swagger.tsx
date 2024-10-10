import { IUnsafeObject } from '@/shared/types';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

type TProperties = {
  spec: IUnsafeObject<any>;
};

function ReactSwagger({ spec }: TProperties) {
  return <SwaggerUI spec={spec} />;
}

export default ReactSwagger;
