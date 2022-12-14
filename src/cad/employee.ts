try {
    const table = await new Promise((resolve, reject) => {
        self.onmessage = (e) => resolve(e.data);

        self.onerror = (e) => reject(e);
    });

    console.log(table);
} catch (e) {
    self.postMessage({ code: "ERROR", error: e });
}

export {};
