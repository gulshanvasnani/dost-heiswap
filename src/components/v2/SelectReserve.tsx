import React, {Component} from 'react';
import Card from "react-bootstrap/Card";
import { SelectReserveModel, ReserveType, ReserveAccount } from "../../models/SelectReserveModel";
import i18n  from "../../i18n";

interface Props {}
interface State {}

export default class SelectReserve extends Component<Props, State> {

  private viewModel?: SelectReserveModel;

  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    this.viewModel = new SelectReserveModel();
    this.setState({});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentWillUnmount() {}

  render() {
    return (
      <Card style={{ width: '36rem' }}>
        <Card.Body>
          <Card.Title>{i18n.t('connect_reserve')}</Card.Title>
          {this.getConnectedOptions()}
          {this.getConnectableOptions()}
        </Card.Body>
      </Card>
    )
  }

  private getConnectedOptions() {
    let options:any = [];
    if (!this.viewModel) {
      options.push( this.getNoOptionView());
    } else {
      let supportedOptions: ReserveAccount[] = this.viewModel!.getReserveAccountList();
      supportedOptions.forEach((option: ReserveAccount)=>{
        options.push(this.getConnectView(option));
      });
      if (options.length === 0) {
        options.push( this.getNoOptionView());
      }
    }
    return options;
  }

  private getConnectableOptions() {
    return [];
  }
  private getNoOptionView() {
    return (
      <Card.Text>
        {i18n.t('no_option_available')}
      </Card.Text>
    );
  }
  private getConnectView(reserveAccount: ReserveAccount){
    const isAccountAvailable = reserveAccount.account!==undefined;
    const connectButtonClass = isAccountAvailable?'btn btn-danger' : 'btn btn-primary';
    const connectButtonDisplayText = isAccountAvailable?'Disconnect' : 'Connect';
    const displayStyleForAccount = isAccountAvailable?'inline' : 'none';
    let action = ()=>{};
    switch (reserveAccount.type) {
      case ReserveType.Dost:
        action = this.dOSTButtonClicked;
        break;
      case ReserveType.Metamask:
        action = isAccountAvailable?this.metamaskDisconnect:this.metamaskConnect;
        break;
      case ReserveType.WalletConnect:
        action = this.walletConnectButtonClicked;
        break;
    }

    return (
    <div className="card" style={{marginBottom: '10px'}}>
      <div className="card-body mb-1">
        <h5 className="card-title">{reserveAccount.title}</h5>
        <p className="text-left">{reserveAccount.description}</p>
        <p className="text-left" style={{display: displayStyleForAccount}}>
          <span style={{fontWeight: 'bolder'}}>Connected account:</span><br/>
          <span style={{fontFamily: 'Courier New'}}>{reserveAccount.account}</span>
        </p>
        <button type="button"
                style={{width: '100%'}}
                className={connectButtonClass}
                onClick={action.bind(this) as any}>
          {connectButtonDisplayText}
        </button>
      </div>
    </div>
    );
  }

  // Click handlers
  public dOSTButtonClicked() {
    console.log('dOSTButtonClicked');
  }
  public async metamaskConnect() {
    console.log('metamaskConnect');
    let connectedAddress = await this.viewModel!.connectWithMetamask();
    this.setState({});

    console.log('connectedAddress: ', connectedAddress);
  }
  public metamaskDisconnect() {
    console.log('metamaskDisconnect');
    this.viewModel!.disconnectMetamask();
    this.setState({});
  }
  public async walletConnectButtonClicked() {
    console.log('walletConnectButtonClicked');
    let connectedAddress = await this.viewModel!.connectWithWalletConnect();
    this.setState({});
  }

}
