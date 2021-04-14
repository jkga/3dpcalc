import React, { useState, useEffect } from 'react';
import { Container, Header, Form, Icon, Menu, Image, Divider, Step, Message, Label } from 'semantic-ui-react'
import Logo from '../../logo.svg'
import bill from './assets/img/bill.png'
import watts from './assets/img/watts.png'

const Homepage = () => {
  const [filamentWeight, setFilamentWeight] : any = useState<number | string>(0);
  const [filamentPrice, setFilamentPrice]: any = useState<number | string>(0);
  const [filamentAmount, setFilamentAmount]: any = useState<number | string>(0);
  const [printWeight, setPrintWeight] : any = useState<number | string>(0);
  const [printTimeHours, setPrintTimeHours]: any = useState<number | string>(0);
  const [printTimeMinutes, setPrintTimeMinutes]: any = useState<number | string>(0);

  const [powerMonthlyConsumption, setPowerMonthlyConsumption]: any = useState<number | string>(0);
  const [powerMonthlyDue, setPowerMonthlyDue]: any = useState<number | string>(0);
  const [powerConsumptionPerHour, setPowerConsumptionPerHour]: any = useState<number | string>(0);

  const [printerPowerEnergyConsumption, setPrinterPowerEnergyConsumption]: any = useState<number | string>(0);
  const [printerPowerConsumptionPerHour, setPrinterPowerConsumptionPerHour]: any = useState<number | string>(0);

  const [printerRatedPower, setPrinterRatedPower]: any = useState<number | string>(0);

  const [totalPrintTime, setTotalPrintTime]: any = useState<number | string>(0);
  const [totalPrintCostPerGram, setTotalPrintCostPerGram]: any = useState<number | string>(0);
  const [totalPrintCostPerHour, setTotalPrintCostPerHour]: any = useState<number | string>(0);
  const [totalPrintEnergyConsumption, setTotalPrintEnergyConsumption]: any = useState<number | string>(0);


  useEffect (() => {
    let filamentAmountPerGram: number = 0
    // convert filament in kg to g and divide by the acquired cost
    filamentAmountPerGram = parseFloat(filamentPrice || 0) / (parseFloat(filamentWeight || 0) * 1000)
    setFilamentAmount(filamentAmountPerGram)
    // compute total cost per gram
    // total = Filament Price (g) * Print Output Weight(g)
    setTotalPrintCostPerGram (filamentAmountPerGram * parseFloat(printWeight || 0))
  }, [filamentWeight, filamentPrice, printWeight])

  useEffect (() => {
    // convert hours to minutes
    setTotalPrintTime(parseFloat(printTimeMinutes || 0) + (parseFloat(printTimeHours || 0) * 60))
  }, [printTimeHours, printTimeMinutes])

  useEffect (() => {
    /**
     * Given
     * You have a total energy consumption of PHP 8.759468599033816 per 0.2875kWh based on your recent usage (30 Days)Hourly Energy Consumption: 2.518347222222222
     * Printers Rated Power = 35 W
     */

    // convert watts to kWh
    // 0.35
    let printerRatedKwh: number = printerRatedPower / 1000

    // 0.35 - 0.2875 = 0.0625
    let excessKwhFromPrinterRatedKwh: any = printerRatedKwh - powerConsumptionPerHour

    // 8.759468599033816
    let energyConsumption: any = (parseFloat (powerMonthlyDue || 0) / parseFloat(powerMonthlyConsumption || 0))

    // 8.759468599033816 * 0.0625 = 0.547466787439614
    let exessEnergyConsumption: any = energyConsumption * excessKwhFromPrinterRatedKwh

    // 8.759468599033816 + 0.547466787439614 = 9.30693538647343
    let newPrinterEnergyConsumption = parseFloat(exessEnergyConsumption) + parseFloat(energyConsumption)

    // update total energy consumption
    // 9.30693538647343 * 0.35 = 3.2574273852657005
    setTotalPrintEnergyConsumption (newPrinterEnergyConsumption * printerRatedKwh)
    setPrinterPowerEnergyConsumption (newPrinterEnergyConsumption)
    setPrinterPowerConsumptionPerHour (printerRatedKwh)
  }, [printerRatedPower, powerConsumptionPerHour, powerMonthlyConsumption, powerMonthlyDue])

  useEffect (() => {
    // convert minutes to hour
    let totalPrintHours: number = parseFloat(totalPrintTime) / 60
    setTotalPrintCostPerHour(totalPrintEnergyConsumption * totalPrintHours)
  }, [totalPrintTime,totalPrintEnergyConsumption])


  useEffect (() => {
    // convert hours to minutes
    //setTotalPrintTime(parseFloat(printTimeMinutes || 0) + (parseFloat(printTimeHours || 0) * 60))
    let energyConsumption = parseFloat (powerMonthlyDue || 0) / parseFloat(powerMonthlyConsumption || 0)
    let kWh = parseFloat(powerMonthlyConsumption || 0) / (24 * 30)

    // derive kWh from monthly power consumption (30 days only)
    setPowerConsumptionPerHour (kWh)

    setTotalPrintEnergyConsumption(energyConsumption * kWh)

  }, [powerMonthlyConsumption, powerMonthlyDue])

  return (
    <Container text>
      <Menu secondary style={{padding: '20px'}}>
        <Menu.Menu position='left'>
          <Menu.Item>
            <Image as='a' href='/' src={Logo} width={100} className='logo'/>
          </Menu.Item>

          <Menu.Item>
            <Header as="h1">3D Print Calculator<Header.Subheader>Calculate your 3d printing cost</Header.Subheader></Header>
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <Step.Group ordered widths={4} size="mini">
        <Step completed={filamentAmount} active>
          <Step.Content>
            <Step.Title>Filament</Step.Title>
            <Step.Description>Weigh your materials</Step.Description>
          </Step.Content>
        </Step>

        <Step completed={totalPrintTime && printWeight}>
          <Step.Content>
            <Step.Title>Print Output</Step.Title>
            <Step.Description>Measure your print time</Step.Description>
          </Step.Content>
        </Step>

        <Step completed={totalPrintEnergyConsumption}>
          <Step.Content>
            <Step.Title>Power Consumption</Step.Title>
            <Step.Description>Estimate your power consumption</Step.Description>
          </Step.Content>
        </Step>

        <Step completed={totalPrintCostPerGram || totalPrintCostPerHour}>
          <Step.Content>
            <Step.Title>Results</Step.Title>
          </Step.Content>
        </Step>
      </Step.Group>

        <Form style={{paddingBottom: 100, paddingTop: 30}}>
          <Header as='h3' dividing>
            Filament
            <Header.Subheader>Price and weight of filament used in your print</Header.Subheader>
          </Header>
          <Form.Field>
            <label>Weight (kg)</label>
            <input type="number" placeholder='Kilogram' min={0} value={filamentWeight || ''} onChange={(e) => setFilamentWeight(e.target.value)}/>
          </Form.Field>
          <Form.Field>
            <label>Price <b>(PHP)</b></label>
            <input type="number" placeholder='Enter Amount' min={0} value={filamentPrice || ''} onChange={(e) => setFilamentPrice(e.target.value)}/>
          </Form.Field>
          <Form.Field>
            <label>Estimated Amount Per Gram <b>(PHP)</b></label>
            <input type="number" placeholder='Total Amount Per Gram' value={filamentAmount || ''}  readOnly disabled/>
          </Form.Field>

          <Divider style={{marginBottom: 50, marginTop: 50}} horizontal><Icon name='cube' /></Divider>

          <Header as='h3' dividing>
            Print Output
            <Header.Subheader>Actual print weight and time</Header.Subheader>
          </Header>

          <Form.Field>
            <label>Weight</label>
            <input type="number" placeholder='Grams' value={printWeight || ''} onChange={(e) => setPrintWeight(e.target.value)}/>
          </Form.Field>
          <Form.Field>
            <label>Time to print <b>(Hours)</b></label>
            <input type="number" placeholder='Enter Print Time (Hours)' min={0} value={printTimeHours || ''} onChange={(e) => setPrintTimeHours(e.target.value)}/>
          </Form.Field>
          <Form.Field>
            <label>Time to print <b>(Minutes)</b></label>
            <input type="number" placeholder='Enter Print Time (Minutes)' value={printTimeMinutes || ''} onChange={(e) => setPrintTimeMinutes(e.target.value)}/>
          </Form.Field>

          { (totalPrintTime || '') &&
            <Message size='tiny' color='green'>
              <p><Icon name='info' />You have a total print time of <b>{totalPrintTime}</b> minute(s)</p>
            </Message>
          }

          <Divider style={{marginBottom: 50, marginTop: 50}} horizontal><Icon name='plug' /></Divider>


          <Header as='h3' dividing>
            Power Consumption
            <Header.Subheader>Compute electricity bill for your 3d print</Header.Subheader>
          </Header>

          <Message size='tiny' color='orange'>
            <Message.Header><Icon name='help' /> How to measure my power consumption</Message.Header>
            <p>Please click the "Show Computation" text below for instructions</p>
          </Message>

          <details>
            <summary>Show Computation</summary><br/>
            <Message color='grey'>
              <p><Icon name='info circle'/> In your <b>most recent electricity bill</b>, please look for the <em>"Total kWh"</em> and <em>"Total Current Amount"</em> section.<br/>
                Please see image below for reference.
              </p>
            </Message>

            <Image as='div' src={bill} width={'100%'} className='bill'/>
            <small><p>&emsp;Sample electricity bill from the Philippines</p></small><br/><br/>

            <Form.Field>
              <label>Monthly kWh Consumption</label>
              <input type="number" placeholder='kWh' min={0}  value={powerMonthlyConsumption || ''} onChange={(e) => setPowerMonthlyConsumption(e.target.value)}/>
            </Form.Field>
            <Form.Field>
              <label>Amount Due</label>
              <input type="number" placeholder='Enter Amount' min={0}  value={powerMonthlyDue || ''} onChange={(e) => {  setPowerMonthlyDue(e.target.value); setPrinterRatedPower(0); }}/>
            </Form.Field>

            { ((powerMonthlyConsumption && powerMonthlyDue) || '') && <Message size='tiny' color='green'>
                <p><Icon name='info' />You have a total energy consumption of PHP <u>{(parseFloat (powerMonthlyDue || 0) / parseFloat(powerMonthlyConsumption || 0)) || ''}</u> per <u>{powerConsumptionPerHour}kWh</u> based on your recent usage (30 Days) with an 
                <em> <Label>hourly</Label> rate of <u>PHP{((parseFloat (powerMonthlyDue || 0) / parseFloat(powerMonthlyConsumption || 0)) || 0) * (powerConsumptionPerHour || 0) }</u></em>
                </p><br/>
                <p>Please enter your power supply's wattage to get more acurate results</p>
                <Image as='div' src={watts} width={'100%'} className='bill'/>
                <Form.Field>
                  <label>Printer's Rated Power <span>(Please refer to your power supply's wattage)</span></label>
                  <input type="number" placeholder='Watts' min={0} style={{width: '90%'}} value={printerRatedPower || ''} onChange={(e) => setPrinterRatedPower(e.target.value)}/>
                </Form.Field>
                { ((printerPowerEnergyConsumption && printerRatedPower) || '') && 
                  <p style={{color: 'red'}}>New total energy consumption: PHP<u>{printerPowerEnergyConsumption}</u> per <u>{printerPowerConsumptionPerHour}kWh</u></p>
                }
              </Message>
            }

          </details>
          <br/><br/>
          
          <Form.Field>
            <label>Amount/kWh <b>(PHP)</b></label>
            <input type="number" placeholder='Energy Consumption per kWh' min={0} value={totalPrintEnergyConsumption} onChange={(e) => setTotalPrintEnergyConsumption(e.target.value)}/>
          </Form.Field>

          <Divider style={{marginBottom: 50, marginTop: 50}} horizontal><Icon name='money' /></Divider>

          <Header as='h3' dividing>
            Total Cost
          </Header>
            <p>Total Filament Cost: <Label>PHP {totalPrintCostPerGram || 0}</Label></p>
            <p>Total Printing Hour Cost: <Label>PHP {totalPrintCostPerHour || 0}</Label></p>
            <p>Total: <Label>PHP {((totalPrintCostPerHour || 0) + (totalPrintCostPerGram || 0))}</Label></p>
        </Form>
     
    </Container>
  );
}

export default Homepage