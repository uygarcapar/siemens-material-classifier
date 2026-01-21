import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IxApplication,
  IxApplicationHeader,
  IxMenu,
  IxMenuItem,
  IxMenuCategory,
  IxContent,
  IxIcon,
} from "@siemens/ix-react";
import { addIcons } from "@siemens/ix-icons";
import {
  iconCheckboxes,
  iconTable,
  iconGlobe,
  iconInfo,
} from "@siemens/ix-icons/icons";

import ClassifyMaterials from "./pages/ClassifyMaterials";
import ViewClassifications from "./pages/ViewClassifications";

addIcons({ iconCheckboxes, iconTable, iconGlobe, iconInfo });

const AppContent = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLanguage === "en" ? "tr" : "en";
    i18n.changeLanguage(newLang);
  };

  const isActive = (path) => location.pathname === path;

  const navigateWithParams = (path) => {
    navigate({
      pathname: path,
      search: location.search,
    });
  };

  return (
    <IxApplication>
      <IxApplicationHeader
        name={t("app.title")}
        style={{
          height: "80px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "20px",
        }}
      >
        <div
          slot="logo"
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            paddingLeft: "20px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 130 22"
            id="logo"
            height="28"
            aria-label="Siemens AG"
            style={{
              display: "block",
            }}
          >
            <defs>
              <path
                id="a"
                d="M7.97 0q1.951 0 5.644.752v3.92q-2.746-1.147-5.102-1.147-3.318-.001-3.318 1.91 0 .713.67 1.165.555.365 3.064 1.545 3.609 1.677 4.806 2.917 1.42 1.472 1.421 3.806 0 3.354-2.786 5.116-2.258 1.429-5.853 1.428-3.036 0-6.116-.751v-4.075q3.325 1.095 5.884 1.095 3.534 0 3.534-1.954a1.63 1.63 0 0 0-.515-1.224q-.527-.525-2.698-1.459-3.894-1.675-5.075-2.856Q0 8.628 0 6.253q0-3.061 2.229-4.664Q4.432-.001 7.97 0m114.337 0q1.991 0 5.155.663l.487.089v3.92q-2.748-1.147-5.116-1.147-3.303-.001-3.302 1.91 0 .713.666 1.165.53.351 3.08 1.545 3.583 1.677 4.791 2.917 1.423 1.472 1.422 3.806 0 3.354-2.772 5.116-2.272 1.429-5.866 1.428a25.7 25.7 0 0 1-6.118-.751v-4.075q3.297 1.095 5.886 1.095 3.534 0 3.533-1.954 0-.729-.5-1.224-.529-.525-2.712-1.459-3.882-1.66-5.076-2.856-1.529-1.545-1.528-3.95c0-2.03.74-3.58 2.228-4.65Q118.766 0 122.307 0M53.92.359l4.962 13.185L63.968.36h6.784v20.636h-5.223V6.384l-5.783 14.82H56.33L50.66 6.384v14.61h-3.881V.36zm-30.145 0v20.636h-5.509V.359zm19.18 0V4.09h-8.82v4.66h7.677v3.404h-7.676v4.898h9.046v3.942H28.827V.359zm46.978 0V4.09h-8.819v4.66h7.677v3.404h-7.677v4.898h9.047v3.942H75.805V.359zm10.237 0 6.774 13.814V.359h3.88v20.636h-6.203l-6.954-14v14h-3.881V.359z"
              ></path>
            </defs>
            <g fill="var(--theme-color-logo)" fillRule="evenodd">
              <mask id="b">
                <use xlinkHref="#a"></use>
              </mask>
              <use xlinkHref="#a"></use>
              <g mask="url(#b)">
                <path d="M0 0h130v22H0z"></path>
              </g>
            </g>
          </svg>
        </div>
      </IxApplicationHeader>

      <IxMenu className="menu-padding">
        <IxMenuItem
          home
          icon="checkboxes"
          onClick={() => navigateWithParams("/classifymaterials")}
          active={isActive("/classifymaterials") || isActive("/")}
          style={{
            fontSize: 15,
            fontWeight:
              isActive("/classifymaterials") || isActive("/") ? 600 : 400,
          }}
        >
          {t("menu.classifyMaterials")}
        </IxMenuItem>

        <IxMenuItem
          icon="table"
          onClick={() => navigateWithParams("/viewclassifications")}
          active={isActive("/viewclassifications")}
          style={{
            fontSize: 15,
            fontWeight: isActive("/viewclassifications") ? 600 : 400,
          }}
        >
          {t("menu.viewClassifications")}
        </IxMenuItem>

        <IxMenuItem slot="bottom" icon="globe" onClick={toggleLanguage}>
          {t("menu.language")}: {currentLanguage.toUpperCase()}
        </IxMenuItem>
      </IxMenu>

      <IxContent>
        <Routes>
          <Route path="/" element={<ClassifyMaterials />} />
          <Route path="/classifymaterials" element={<ClassifyMaterials />} />
          <Route
            path="/viewclassifications"
            element={<ViewClassifications />}
          />
        </Routes>
      </IxContent>
    </IxApplication>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
