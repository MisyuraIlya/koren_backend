import { SetMetadata } from '@nestjs/common';

export const EXCLUDE_TRANSFORM_INTERCEPTOR = 'excludeTransformInterceptor';

export const ExcludeTransformInterceptor = () => SetMetadata(EXCLUDE_TRANSFORM_INTERCEPTOR, true);
