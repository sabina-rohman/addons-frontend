import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchAddon } from 'core/api';
import { loadEntities } from 'core/actions';
import { gettext as _ } from 'core/utils';

import 'core/css/SearchForm.scss';
import 'core/css/lib/buttons.scss';


export class AdminSearchFormBase extends React.Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    loadAddon: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    query: PropTypes.string,
  }
  static contextTypes = {
    router: PropTypes.object,
  }

  goToSearch(query) {
    const { pathname } = this.props;
    this.context.router.push(`${pathname}?q=${query}`);
  }

  handleGo = () => {
    const query = this.refs.query.value;
    this.props.loadAddon({ api: this.props.api, query })
      .then(
        (slug) => this.context.router.push(`/search/addons/${slug}`),
        () => this.goToSearch(query));
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        this.handleGo();
      } else {
        this.handleSearch();
      }
    }
  }

  handleSearch = () => {
    this.goToSearch(this.refs.query.value);
  }

  render() {
    const { pathname, query } = this.props;
    return (
      <form ref="form" className="search-form" method="GET"
            action={pathname} onKeyDown={this.handleKeyDown}
            onSubmit={(e) => e.preventDefault()}>
        <label className="visually-hidden" htmlFor="q">{_('Search')}</label>
        <input ref="query" type="search" name="q" placeholder={_('Search')}
               defaultValue={query} />
        <button className="button button-middle" type="submit" title="Enter"
                ref={(ref) => { this.submitButton = ref; }}
                onClick={this.handleSearch}>
          {_('Search')}
        </button>
        <button className="button button-end button-inverse" ref="go"
                onClick={this.handleGo} title="Shift + Enter">
          {_("I'm Feeling Lucky")}
        </button>
      </form>
    );
  }
}

export function mapStateToProps({ api }) {
  return { api };
}

export function mapDispatchToProps(dispatch) {
  return {
    loadAddon({ api, query }) {
      return fetchAddon({ slug: query, api })
        .then(({ entities, result }) => {
          dispatch(loadEntities(entities));
          return result;
        });
    },
  };
}

export default connect(mapStateToProps,
                       mapDispatchToProps)(AdminSearchFormBase);
