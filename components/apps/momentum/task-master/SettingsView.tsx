import { SettingsViewProps } from "./types";

const SettingsView: React.FC<SettingsViewProps> = ({
  onLogout,
  currentTheme,
  toggleTheme,
  themeClasses,
  currentUser,
}) => (
  <div className="space-y-6">
    <div>
      <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>Appearance</h3>
      <button
        onClick={toggleTheme}
        className={`w-full p-3 rounded-lg ${themeClasses.btnSecondary} flex justify-between items-center`}
      >
        <span>Theme: {currentTheme === "light" ? "Light" : "Dark"}</span>
        <i className={`fas ${currentTheme === "light" ? "fa-moon" : "fa-sun"}`}></i>
      </button>
    </div>
    <div>
      <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>Account</h3>
      <p className={`${themeClasses.text} text-sm mb-1 break-all`}>
        Logged in as: {currentUser.email || `UID: ${currentUser.uid}`}
      </p>
      <button
        onClick={onLogout}
        className="w-full p-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
    <div>
      <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>About</h3>
      <p className={`${themeClasses.text} text-sm`}>TaskMaster Pro v1.0.0 (React)</p>
      <p className={`${themeClasses.text} text-sm`}>Developed by: Vikram Kumar</p>
    </div>
  </div>
);

export default SettingsView
