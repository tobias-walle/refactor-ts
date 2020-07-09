import { rename } from './rename';
import { Files, getProjectFiles, prepareInMemoryProject } from './utils/in-memory-project';

describe('rename', () => {
  it('should rename a group of files', async () => {
    const inputFiles: Files = {
      '/src/redux/bookings.actions.ts': `
export const FETCH_BOOKINGS_ACTIONS = asyncActionTypes({
  TRIGGER: 'FETCH_BOOKINGS_TRIGGER',
  REPEAT: 'FETCH_BOOKINGS_REPEAT',
  SUCCESS: 'FETCH_BOOKINGS_SUCCESS',
  FAILURE: 'FETCH_BOOKINGS_FAILURE',
  RESET: 'FETCH_BOOKINGS_RESET',
});

export type FetchBookingsDefinition = AsyncStateDefinition<
  typeof FETCH_BOOKINGS_ACTIONS,
  BookingsResponse,
  BookingsRequest
>;

export const fetchBookingsActions = createActionCreatorsForAsyncState<
  FetchBookingsDefinition
>(FETCH_BOOKINGS_ACTIONS);
      `.trim(),

      '/src/redux/bookings.epic.ts': `
import {
  FETCH_BOOKINGS_ACTIONS,
  fetchBookingsActions,
  FetchBookingsDefinition,
} from './bookings.actions';

const bookingsEpic = createEpicForAsyncState<FetchBookingsDefinition, AppState>(
  FETCH_BOOKINGS_ACTIONS,
  fetchBookingsActions,
  ({ token, bookingDate, employee }) => axios.get('/test/url'),
  (s) => s.bookings,
);

export default bookingsEpic;
      `.trim(),

      '/src/redux/bookings.reducer.ts': `
import {
  FETCH_BOOKINGS_ACTIONS,
  FetchBookingsDefinition,
} from './bookings.actions';

const bookingsReducer = createReducerForAsyncState<FetchBookingsDefinition>(
  FETCH_BOOKINGS_ACTIONS,
);

export default bookingsReducer;
      `.trim(),

      '/src/redux/bookingsStyles.css': `div { color: red }`,
    };
    const expectedOutput: Files = {
      '/src/redux/externalBookings.actions.ts': `
export const FETCH_EXTERNAL_BOOKINGS_ACTIONS = asyncActionTypes({
  TRIGGER: 'FETCH_EXTERNAL_BOOKINGS_TRIGGER',
  REPEAT: 'FETCH_EXTERNAL_BOOKINGS_REPEAT',
  SUCCESS: 'FETCH_EXTERNAL_BOOKINGS_SUCCESS',
  FAILURE: 'FETCH_EXTERNAL_BOOKINGS_FAILURE',
  RESET: 'FETCH_EXTERNAL_BOOKINGS_RESET',
});

export type FetchExternalBookingsDefinition = AsyncStateDefinition<
  typeof FETCH_EXTERNAL_BOOKINGS_ACTIONS,
  BookingsResponse,
  BookingsRequest
>;

export const fetchExternalBookingsActions = createActionCreatorsForAsyncState<
  FetchExternalBookingsDefinition
>(FETCH_EXTERNAL_BOOKINGS_ACTIONS);
      `.trim(),

      '/src/redux/externalBookings.epic.ts': `
import {
  FETCH_EXTERNAL_BOOKINGS_ACTIONS,
  fetchExternalBookingsActions,
  FetchExternalBookingsDefinition,
} from './externalBookings.actions';

const externalBookingsEpic = createEpicForAsyncState<FetchExternalBookingsDefinition, AppState>(
  FETCH_EXTERNAL_BOOKINGS_ACTIONS,
  fetchExternalBookingsActions,
  ({ token, bookingDate, employee }) => axios.get('/test/url'),
  (s) => s.bookings,
);

export default externalBookingsEpic;
      `.trim(),

      '/src/redux/externalBookings.reducer.ts': `
import {
  FETCH_EXTERNAL_BOOKINGS_ACTIONS,
  FetchExternalBookingsDefinition,
} from './externalBookings.actions';

const externalBookingsReducer = createReducerForAsyncState<FetchExternalBookingsDefinition>(
  FETCH_EXTERNAL_BOOKINGS_ACTIONS,
);

export default externalBookingsReducer;
      `.trim(),

      '/src/redux/externalBookingsStyles.css': `div { color: red }`,
    };
    const project = await prepareInMemoryProject(inputFiles);

    await rename({
      project,
      fileOrFolderPath: '/src/redux/bookings.actions.ts',
      oldName: 'bookings',
      newName: 'externalBookings'
    });
    await project.save();

    expect(await getProjectFiles(project)).toEqual(expectedOutput);
  });

  it('should rename a folder with child files', async () => {
    const inputFiles: Files = {
      '/src/components/MyComponent/MyComponent.ts': `export const MyComponent = () => 'Test';`,
      '/src/components/MyComponent/MyComponent.test.ts': `describe('MyComponent', () => {});`,
      '/src/components/MyComponent/MyComponent.css': `div { color: red }`,
      '/src/components/OtherComponent/OtherComponent.tsx': `
import { MyComponent } from '../MyComponent/MyComponent';
      
export const OtherComponent = MyComponent();
      `,
    };
    const expectedOutput: Files = {
      '/src/components/YourComponent/YourComponent.ts': `export const YourComponent = () => 'Test';`,
      '/src/components/YourComponent/YourComponent.test.ts': `describe('YourComponent', () => {});`,
      '/src/components/YourComponent/YourComponent.css': `div { color: red }`,
      '/src/components/OtherComponent/OtherComponent.tsx': `
import { YourComponent } from '../YourComponent/YourComponent';
      
export const OtherComponent = YourComponent();
      `,
    };
    const project = await prepareInMemoryProject(inputFiles);

    await rename({
      project,
      fileOrFolderPath: '/src/components/MyComponent',
      oldName: 'MyComponent',
      newName: 'YourComponent'
    });
    await project.save();

    expect(await getProjectFiles(project)).toEqual(expectedOutput);
  });
});
