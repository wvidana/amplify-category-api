import { $TSContext } from 'amplify-cli-core';
import { AppsyncApiInputState } from '../../../../provider-utils/awscloudformation/api-input-manager/appsync-api-input-state';

jest.mock('fs-extra');

jest.mock('amplify-cli-core', () => ({
  ...(jest.requireActual('amplify-cli-core') as {}),
  pathManager: {
    getBackendDirPath: jest.fn().mockReturnValue('mockbackendDirPath'),
    findProjectRoot: jest.fn().mockReturnValue('mockProject'),
  },
  JSONUtilities: {
    parse: JSON.parse,
    readJson: jest
      .fn()
      .mockReturnValueOnce({
        version: 1,
        serviceConfiguration: {
          apiName: 'authv2migration1',
          serviceName: 'AppSync',
          gqlSchemaPath: 'mock/schema.graphql',
          defaultAuthType: {
            mode: 'AWS_IAM',
          },
          conflictResolution: {},
          additionalAuthTypes: [
            {
              mode: 'API_KEY',
              expirationTime: 7,
              keyDescription: '',
            },
          ],
        },
      })
      .mockReturnValueOnce({}),
  },
}));

const mockContext: $TSContext = {
  amplify: {
    getCategoryPluginInfo: (_context: $TSContext, category: string) => {
      return {
        packageLocation: `@aws-amplify/amplify-category-${category}`,
      };
    },
  },
  input: {
    options: {},
  },
} as unknown as $TSContext;

test('Api Input State -> validate cli payload manual payload', async () => {
  const resourceName = 'mockResource';
  const apiState = new AppsyncApiInputState(mockContext, resourceName);
  expect(await apiState.isCLIInputsValid()).toBe(true);
});

test('Api Input State -> validate cli payload manual payload to throw error', async () => {
  const resourceName = 'mockResource';
  const apiState = new AppsyncApiInputState(mockContext, resourceName);
  expect(apiState.isCLIInputsValid()).rejects.toThrowError();
});
