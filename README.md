# Angular 20 Todo Application

A full-featured Todo application built with Angular 20, Material Design, NgRx, and i18n support.

## Features

- ✅ **CRUD Operations**: Create, read, update, and delete todos
- 🎨 **Material Design**: Clean and modern UI with Angular Material
- 🌓 **Dark/Light Theme**: Toggle between themes with persistent storage
- 🌍 **Internationalization**: English and Arabic language support with RTL
- 📊 **State Management**: NgRx for predictable state management
- 🔄 **Reactive Programming**: RxJS for handling async operations
- 📱 **Responsive Design**: Works on all screen sizes
- ⚡ **Signals**: Modern Angular signals for reactive state
- 🎯 **Standalone Components**: Leveraging Angular's latest architecture

## Project Structure

```
src/
├── app/
│   ├── core/                  # App-wide singletons
│   │   ├── services/          # Todo, Theme, Language services
│   │   ├── interceptors/      # HTTP error and loading interceptors
│   │   └── models/            # API response models
│   ├── features/              # Feature modules
│   │   └── todo/
│   │       ├── components/    # Todo item and list
│   │       ├── pages/         # Todo page container
│   │       ├── store/         # NgRx state management
│   │       ├── models/        # Todo models
│   │       └── services/      # Todo facade
│   ├── shared/                # Reusable components
│   │   ├── components/        # Header, Footer, Language Switcher
│   │   └── material/          # Material module
│   └── assets/
│       └── i18n/              # Translation files
└── environments/              # Environment configurations
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create the database file:**
   Create a file named `db.json` in the project root with the provided JSON content.

3. **Start the JSON Server:**
   ```bash
   npx json-server db.json --port 3000
   ```

4. **Start the Angular application:**
   ```bash
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:4200`

## NPM Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run watch` - Build in watch mode

## JSON Server

The application uses JSON Server as a fake REST API. It should run on port 3000.

**Endpoints:**
- `GET /todos` - Get all todos
- `GET /todos/:id` - Get single todo
- `POST /todos` - Create new todo
- `PATCH /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo

## Features in Detail

### State Management (NgRx)
- Actions for all CRUD operations
- Effects for handling side effects
- Selectors for derived state
- Facade pattern for clean component integration

### Theming
- Light and dark themes
- Persistent theme selection
- Smooth transitions

### Internationalization
- English and Arabic translations
- RTL support for Arabic
- Language switcher component
- Persistent language selection

### Components
- **Header**: App title, language switcher, theme toggle
- **Footer**: Copyright information
- **Todo Page**: Main container with stats and filters
- **Todo List**: Display todos with loading states
- **Todo Item**: Individual todo with toggle and delete

## Technologies

- **Angular**: 20.3.0
- **Angular Material**: 20.2.11
- **NgRx**: 20.1.0
- **ngx-translate**: 17.0.0
- **RxJS**: 7.8.0
- **TypeScript**: 5.9.2
- **JSON Server**: 1.0.0-beta.3

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

1. **Adding new translations**: Edit `src/assets/i18n/en.json` and `ar.json`
2. **Modifying theme colors**: Update `src/styles.scss` Material palettes
3. **Adding new features**: Follow the feature module pattern in `src/app/features`
4. **HTTP interceptors**: Add new interceptors in `src/app/core/interceptors`

## License

MIT License. See `LICENSE` file for details.
