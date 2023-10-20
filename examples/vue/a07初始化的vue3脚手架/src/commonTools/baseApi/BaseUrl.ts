export default class BaseUrl {
    public getippath(): string {
        let curWwwPath: string, pathName: string, pos: number, localhostPaht: string, projectName: string;
        //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
        curWwwPath = window.document.location.href;
        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
        pathName = window.document.location.pathname;
        pos = curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8083
        localhostPaht = curWwwPath.substring(0, pos);
        //获取带"/"的项目名，如：/uimcardprj
        projectName = pathName.substring(0, pathName.substr(1).indexOf("/") + 1);
        let withouthttpPath = localhostPaht.substr(7, localhostPaht.length - 7);
        let posPort = withouthttpPath.indexOf(":");
        if (posPort != -1) {
            withouthttpPath = withouthttpPath.substr(0, posPort);
        }
        return "http://" + withouthttpPath;
    }

    public getWithPortRootpath(): string {
        let curWwwPath: string, pathName: string, pos: number, localhostPaht: string, projectName: string;
        //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
        curWwwPath = window.document.location.href;
        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
        pathName = window.document.location.pathname;
        pos = curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8083
        localhostPaht = curWwwPath.substring(0, pos);
        //获取带"/"的项目名，如：/uimcardprj
        projectName = pathName.substring(0, pathName.substr(1).indexOf("/") + 1);
        let withouthttpPath = localhostPaht.substr(7, localhostPaht.length - 7);
        let port = "";
        let withoutPortPath = "";
        let posPort = withouthttpPath.indexOf(":");
        if (posPort != -1) {
            withoutPortPath = withouthttpPath.substr(0, posPort);
            port = withouthttpPath.substr(posPort, withouthttpPath.length - posPort);
        } else {
            withoutPortPath = withouthttpPath;
            port = "";
        }
        return "http://" + withoutPortPath + port;
    }
}
