module.exports = { Bucket }
function Bucket(fileName) {
    return new (class {
        constructor(fileName) {

            this.fileName = fileName;
            this.ensureFileExists();
            this.data = this.readFile();
        }
        ensureFileExists() {
            this.fs ? this.fs : (this.fs = require("fs"));
            this.path ? this.path : (this.path = require("path"));

            this.filePath = this.path.join(__dirname, this.fileName);

            if (!this.fs.existsSync(this.filePath)) {
                this.fs.writeFileSync(this.filePath, "{}");
            }
        }
        readFile() {
            try {
                const data = this.fs.readFileSync(this.filePath, "utf-8");
                return JSON.parse(data);
            } catch (error) {
                console.error(`Error reading file:${error}`);
                return {};
            }
        }
        writeFile() {
            try {
                this.fs.writeFileSync(
                    this.filePath,
                    JSON.stringify(this.data, null, 2)
                );
            } catch (error) { }
        }
        set(key, value) {
            this.data[key] = value;
            this.writeFile();
        }
        get(key) {
            return this.data[key];
        }
    })(fileName);
}
