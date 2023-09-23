import ErrorBoundary from '@/services/ErrorBoundary';
import { history } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';

const NoFoundPage: React.FC = () => {
  console.log('404页面');
  return (
    <ErrorBoundary>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => history.push('/')}>
            Back Home
          </Button>
        }
      />
    </ErrorBoundary>
  );
};

export default NoFoundPage;
