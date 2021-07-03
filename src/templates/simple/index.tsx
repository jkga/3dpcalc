interface PrintableData {
  model?: any,
  others?: any,
  total: number | string,
  currency: string,
  modelName: string,
  printerType: string,
  materials: any,
  printOutput?: any,
  laborFee?: any,
}

class SimpleTemplate {
  data: any
  totalModelCost: number
  totalOtherCost: number
  profit: number

  constructor (data: PrintableData) {
    this.data = data
    this.totalModelCost = parseFloat(this.data.model.materialCost) + parseFloat(this.data.model.electricityCost)
    this.totalOtherCost = parseFloat(this.data.others.setupFee) + parseFloat(this.data.others.packagingFee) + parseFloat(this.data.others.deliveryFee)+ parseFloat(this.data.others.otherFee)
    this.profit = parseFloat(this.data.model.markupCost) + parseFloat(this.data.laborFee)
  }

  render () {
    return `
      <body style="font-size: 11px;">
        <header style="padding: 20px;">
          <div style="white-space: nowrap;">
            <h1 style="line-height:1px;font-size: 16px;word-spacing: 3px;">${this.data.modelName || '3D Print Calculator'}</h1>
            <small style="color: gray;font-size: 8px;">
              <p>
                Powered by 3D Print Calculator: calculate your 3d printing cost<br/>
                <a href="https://3dpcalc.vercel.app/">https://3dpcalc.vercel.app/</a>
              </p>
            </small>
            <div style="float:left;width: 550px; height:1px;background:#000;margin-top: 15px;">&nbsp;</div>
          </div>
        </header>

        <main style="padding: 20px;padding-top: 5px;font-size: 10px;">
          <div style="white-space: nowrap;">
            <h3 style="font-size: 12px;">General&nbsp;Information</h3>
            <div style="width: 550px; height:auto;background:rgba(240,240,240,0.6);padding: 5px;">
              <p style="font-size: 8px;">
                <b>Materials</b>
                <span style="float:right;font-weight:bold;text-transform: uppercase;">${this.data.printerType}</span>
              </p>
            </div>
            <p style="width: 550px;padding-left: 5px;">Weight: <span style="float:right;">${this.data.materials.filamentWeight || ''} ${this.data.printerType === 'sla' ? 'liter(s)' : 'kilogram(s)'}</span></p>
            <p style="width: 550px;padding-left: 5px;">Price: <span style="float:right;">${this.data.materials.filamentPrice || ''}</span></p>
            <p style="width: 550px;padding-left: 5px;">Amount Per ${this.data.printerType === 'sla' ? 'mililiter' : 'gram'}: <span style="float:right;">${this.data.materials.filamentAmount || ''}</span></p>

            <div style="width: 550px; height:auto;background:rgba(240,240,240,0.6);padding: 5px;">
              <p style="font-size: 8px;">
                <b>Output</b>
              </p>
            </div>
            <p style="width: 550px;padding-left: 5px;">${this.data.printerType === 'sla' ? 'Volume' : 'Weight'}: <span style="float:right;">${this.data.printOutput.printWeight || ''} ${this.data.printerType === 'sla' ? 'liter(s)' : 'kilogram(s)'}</span></p>
            <p style="width: 550px;padding-left: 5px;">Hour(s): <span style="float:right;">${this.data.printOutput.printTimeHours || ''}h</span></p>
            <p style="width: 550px;padding-left: 5px;">Minute(s): <span style="float:right;">${this.data.printOutput.printTimeMinutes || ''}m</span></p>
          </div>
          <div style="float:left;width: 550px; height:1px;background:#000;margin-top: 15px;">&nbsp;</div>
        </main>

        <main style="padding: 20px;padding-top: 5px;font-size: 10px;">
          <div style="white-space: nowrap;">
            <h3 style="font-size: 12px;">Breakdown</h3>
            <div style="width: 550px; height:auto;background:rgba(240,240,240,0.6);padding: 5px;">
              <p style="font-size: 8px;">
                <b>MODEL COST</b>
                <span style="float:right;">(${this.data.currency}${this.totalModelCost || '0.00'})</span>
              </p>
            </div>

            <p style="width: 550px;padding-left: 5px;">Material Cost: <span style="float:right;">${this.data.model.materialCost || ''}</span></p>
            <p style="width: 550px;padding-left: 5px;">Electricity Cost: <span style="float:right;">${this.data.model.electricityCost || ''}</span></p>

            <div style="width: 550px; height:auto;background:rgba(240,240,240,0.6);padding: 5px;">
              <p style="font-size: 8px;">
                <b>OTHER COST</b>
                <span style="float:right;">(${this.data.currency}${this.totalOtherCost || '0.00'})</span>
              </p>
            </div>

            <p style="width: 550px;padding-left: 5px;">Setup Fee: <span style="float:right;">${this.data.others.setupFee }</span></p>
            <p style="width: 550px;padding-left: 5px;">Packaging Fee: <span style="float:right;">${this.data.others.packagingFee || ''}</span></p>
            <p style="width: 550px;padding-left: 5px;">Delivery Fee: <span style="float:right;">${this.data.others.deliveryFee || ''}</span></p>
            <p style="width: 550px;padding-left: 5px;">Others (glue, pei sheet, etc...): <span style="float:right;">${this.data.others.otherFee || ''}</span></p>

            <div style="width: 550px; height:auto;background:rgba(240,240,240,0.6);padding: 5px;">
              <p style="font-size: 8px;">
                <b>MODEL MARKUP</b>
                <span style="float:right;">(${this.data.model.markup}%)</span>
              </p>
            </div>
            <p style="width: 550px;padding: 5px;">Markup (${this.data.model.markup}%): <span style="float:right;">${this.data.model.markupCost || ''}</span></p>
            <p style="width: 550px;padding-left: 5px;">Labor Fee (pre and post processing): <span style="float:right;">${this.data.laborFee || ''}</span></p>
          </div>
        </main>

        <main style="padding: 20px;padding-top: 0px;">
          <div style="white-space: nowrap;">
            <div style="width: 550px; height:30px;background:rgba(240,240,240,0.6);text-align: right;">
              <p style="font-size: 11px;padding: 5px;font-weight: bold;">Total:&nbsp;<span style="color:teal;padding-left:10px;">${this.data.currency} ${this.data.total}</span></p>
            </div>
            <div style="width: 550px; height:20px;background:rgba(253, 227, 167, 0.4);text-align: right;opacity:0.6;">
              <p style="font-size: 8px;padding: 5px;font-weight: bold;">Profit:&nbsp;<span>${this.data.currency} ${this.profit || 0.00}</span></p>
            </div>
          </div>
        </main>

      </body>
    `
  }

}

export { SimpleTemplate }