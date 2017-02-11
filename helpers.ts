
const path = require('path');
const fs = require('fs');

export class Helpers {

    private _root = path.resolve(__dirname);

    constructor() {};

    public checkNodeImport(context, request, cb) {
        if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
            cb(null, 'commonjs ' + request); return;
        }
        cb();
    };

    public includeClientPackages(packages) {
        return function (context, request, cb) {
            if (packages && packages.indexOf(request) !== -1) {
                return cb();
            }
            return this.checkNodeImport(context, request, cb);
        };
    }

    public hasProcessFlag(flag) {
        return process.argv.join('').indexOf(flag) > -1;
    }

    public root(args) {
        args = Array.prototype.slice.call(arguments, 0);
        return path.join.apply(path, [this._root].concat(args));
    }

    public testDll() {
        if (!fs.existsSync('./dll/polyfill.dll.js') || !fs.existsSync('./dll/vendor.dll.js')) {
            throw "DLL files do not exist, please use 'npm run build:dll' once to generate dll files.";
        }
    };

};