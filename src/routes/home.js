/**
 * Created by oyhanyu on 2017/8/8.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Menu, Breadcrumb, Card, Col, Row } from 'antd';
const { Header, Content, Footer } = Layout;
import styles from './home.less';

const Home = ( props ) => {
    let { loading, weatherData, showDays, btnText, dispatch } = props;
    const handleClickMore = () => {
        dispatch({
            type: 'home/more',
            showDays: showDays===3 ? 6 : 3
        })
    };
    return (
        <Layout className={styles['ou-layout']}>
            <Header>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="1">首页</Menu.Item>
                </Menu>
            </Header>
            <Breadcrumb className={styles.breadCrumb} separator="》">
                <Breadcrumb.Item>天气</Breadcrumb.Item>
                <Breadcrumb.Item>中国</Breadcrumb.Item>
                <Breadcrumb.Item>北京</Breadcrumb.Item>
            </Breadcrumb>
            <Content className={styles.content}>
                {
                    weatherData.map( (weather, index) => {
                        const { now, today, future} = weather;
                        const suggestion = today.suggestion;
                        const pic = 'http://s2.sencdn.com/web/icons/3d_50/'+now.code+'.png';
                        return (
                            <div key={index}>
                                <p>pm2.5：{now.air_quality.city.pm25}</p>
                                <p>空气质量：{now.air_quality.city.quality}</p>
                                <div>
                                    <span className={styles.temperature}>{now.temperature}</span>
                                    <span style={{verticalAlign:'top', fontSize: 30}}>&#176;</span>
                                    <img src={pic} alt=""/>
                                    <span>{now.text}</span>
                                    <p>
                                        <span>湿度：{now.humidity}%</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                        <span>{now.wind_direction}风{now.wind_scale}级</span>
                                    </p>
                                    <p>
                                        今日天气提示：{today.suggestion.dressing.details}
                                    </p>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Card noHovering title={`未来${showDays}天天气`}  extra={<a href="javascript:void(0)" onClick={handleClickMore} style={{color:'#ffffff'}}>{btnText}</a>} style={{background:'#e9e9e9'}}>
                                                {
                                                    future.map( (ft, index) => {
                                                        if (index < showDays) {
                                                            const pic1 = 'http://s2.sencdn.com/web/icons/3d_50/'+ft.code2+'.png';
                                                            return (
                                                                <div key={index}>
                                                                    <Card.Grid className={styles.gridStyle}>{ft.day}</Card.Grid>
                                                                    <Card.Grid className={styles.gridStyle}>{ft.text}</Card.Grid>
                                                                    <Card.Grid className={styles.gridStyle}>
                                                                        <img src={pic1} alt="" style={{width:24, height: 14}}/>
                                                                    </Card.Grid>
                                                                    <Card.Grid className={styles.gridStyle}>{ft.low}/{ft.high}</Card.Grid>
                                                                    <Card.Grid className={styles.gridStyle}>{ft.wind}</Card.Grid>
                                                                </div>
                                                            )
                                                        }
                                                    })
                                                }
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Card noHovering title="其他指数" style={{background:'#e9e9e9'}}>
                                                <Card.Grid className={styles.gridStyleLg}>
                                                    <p>穿衣：{suggestion.dressing.brief}</p>
                                                    <p>{suggestion.dressing.details}</p>
                                                </Card.Grid>
                                                <Card.Grid className={styles.gridStyleLg}>
                                                    <p>紫外线：{suggestion.uv.brief}</p>
                                                    <p>{suggestion.uv.details}</p>
                                                </Card.Grid>
                                                <Card.Grid className={styles.gridStyleLg}>
                                                    <p>洗车：{suggestion.car_washing.brief}</p>
                                                    <p>{suggestion.car_washing.details}</p>
                                                </Card.Grid>
                                                <Card.Grid className={styles.gridStyleLg}>
                                                    <p>外出：{suggestion.travel.brief}</p>
                                                    <p>{suggestion.travel.details}</p>
                                                </Card.Grid>
                                                <Card.Grid className={styles.gridStyleLg}>
                                                    <p>感冒：{suggestion.flu.brief}</p>
                                                    <p>{suggestion.flu.details}</p>
                                                </Card.Grid>
                                                <Card.Grid className={styles.gridStyleLg}>
                                                    <p>运动：{suggestion.sport.brief}</p>
                                                    <p>{suggestion.sport.details}</p>
                                                </Card.Grid>
                                                <Card.Grid className={styles.gridStyleLg}>
                                                    <p>限行：{suggestion.restriction.brief}</p>
                                                    <p>{suggestion.restriction.details}</p>
                                                </Card.Grid>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        )
                    })
                }
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                ©2017
            </Footer>
        </Layout>
    )
};
Home.propTypes = {
    loading: PropTypes.bool,
    weatherData: PropTypes.array,
    showDays: PropTypes.number,
    dispatch: PropTypes.func,
    btnText: PropTypes.string
};
function mapStateToProps(state) {
    return {
        weatherData: state.home.weatherData,
        loading: state.loading.models.home,
        showDays: state.home.showDays,
        btnText: state.home.btnText
    };
}

// export default Home;
export default connect(mapStateToProps)(Home);